package middleware

import (
	"fmt"
	"math"
	"sync"
	"time"
)

type State string

const (
	StateClosed   State = "closed"
	StateOpen     State = "open"
	StateHalfOpen State = "half_open"
)

type CircuitBreaker struct {
	mu                  sync.Mutex
	name                string
	state               State
	failures            int
	maxFailures         int
	cooldownDuration    time.Duration
	lastStateChange     time.Time
}

func NewCircuitBreaker(name string, maxFailures int, cooldown time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		name:             name,
		state:            StateClosed,
		maxFailures:      maxFailures,
		cooldownDuration: cooldown,
		lastStateChange:  time.Now(),
	}
}

func (cb *CircuitBreaker) State() State {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.state == StateOpen && time.Since(cb.lastStateChange) > cb.cooldownDuration {
		cb.state = StateHalfOpen
		cb.lastStateChange = time.Now()
	}

	return cb.state
}

func (cb *CircuitBreaker) RecordResult(err error) {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil {
		cb.failures++
		if cb.failures >= cb.maxFailures {
			cb.state = StateOpen
			cb.lastStateChange = time.Now()
		}
	} else {
		cb.failures = 0
		cb.state = StateClosed
		cb.lastStateChange = time.Now()
	}
}

// CalculateExponentialBackoff returns backoff duration for attempt (0-indexed).
func CalculateExponentialBackoff(attempt int, baseBackoff time.Duration) time.Duration {
	mult := math.Pow(2, float64(attempt))
	return baseBackoff * time.Duration(mult)
}

type RetryInvoker func(attempt int) (map[string]interface{}, error)

// InvokeWithRetry executes fn up to maxRetries times with exponential backoff.
func InvokeWithRetry(
	cb *CircuitBreaker,
	maxRetries int,
	baseBackoff time.Duration,
	fn RetryInvoker,
) (map[string]interface{}, int, error) {
	if cb != nil && cb.State() == StateOpen {
		return nil, 0, fmt.Errorf("circuit breaker open for tool %s", cb.name)
	}

	var lastErr error
	for attempt := 0; attempt <= maxRetries; attempt++ {
		if attempt > 0 {
			backoff := CalculateExponentialBackoff(attempt-1, baseBackoff)
			time.Sleep(backoff)
		}

		res, err := fn(attempt)
		if err == nil {
			if cb != nil {
				cb.RecordResult(nil)
			}
			return res, attempt, nil
		}

		lastErr = err
	}

	if cb != nil {
		cb.RecordResult(lastErr)
	}

	return nil, maxRetries, fmt.Errorf("tool execution failed after %d retries: %w", maxRetries, lastErr)
}
