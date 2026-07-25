package middleware

import (
	"errors"
	"testing"
	"time"
)

func TestExponentialBackoffCalculation(t *testing.T) {
	base := 10 * time.Millisecond

	b0 := CalculateExponentialBackoff(0, base)
	if b0 != 10*time.Millisecond {
		t.Errorf("expected 10ms got %v", b0)
	}

	b1 := CalculateExponentialBackoff(1, base)
	if b1 != 20*time.Millisecond {
		t.Errorf("expected 20ms got %v", b1)
	}

	b2 := CalculateExponentialBackoff(2, base)
	if b2 != 40*time.Millisecond {
		t.Errorf("expected 40ms got %v", b2)
	}
}

func TestCircuitBreakerTrips(t *testing.T) {
	cb := NewCircuitBreaker("test-tool", 3, 100*time.Millisecond)

	if cb.State() != StateClosed {
		t.Fatalf("expected initial state closed")
	}

	cb.RecordResult(errors.New("fail 1"))
	cb.RecordResult(errors.New("fail 2"))
	if cb.State() != StateClosed {
		t.Fatalf("expected state closed after 2 failures")
	}

	cb.RecordResult(errors.New("fail 3"))
	if cb.State() != StateOpen {
		t.Fatalf("expected state open after 3 failures")
	}
}

func TestInvokeWithRetrySuccessAfterRetry(t *testing.T) {
	cb := NewCircuitBreaker("retry-tool", 3, 100*time.Millisecond)

	attempts := 0
	res, retryCount, err := InvokeWithRetry(cb, 3, 1*time.Millisecond, func(attempt int) (map[string]interface{}, error) {
		attempts++
		if attempt < 2 {
			return nil, errors.New("temporary failure")
		}
		return map[string]interface{}{"status": "success"}, nil
	})

	if err != nil {
		t.Fatalf("expected success, got %v", err)
	}

	if attempts != 3 {
		t.Errorf("expected 3 total calls (attempt 0, 1, 2), got %d", attempts)
	}

	if retryCount != 2 {
		t.Errorf("expected retryCount 2, got %d", retryCount)
	}

	if res["status"] != "success" {
		t.Errorf("expected status success")
	}
}
