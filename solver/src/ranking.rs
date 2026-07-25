use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OptionItem {
    pub id: String,
    pub label: Option<String>,
    pub price: f64,
    pub convenience_score: f64, // 0.0 to 1.0
    pub flexibility_score: f64, // 0.0 to 1.0
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RankingWeights {
    pub price: f64,       // weight 0.0 to 1.0
    pub convenience: f64, // weight 0.0 to 1.0
    pub flexibility: f64, // weight 0.0 to 1.0
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RankRequest {
    pub task_id: String,
    pub options: Vec<OptionItem>,
    pub weights: RankingWeights,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RankResponse {
    pub task_id: String,
    pub ranked_ids: Vec<String>,
    pub scores: HashMap<String, f64>,
}

/// Ranks options based on multi-objective weighted optimization score.
pub fn rank_options(req: &RankRequest) -> RankResponse {
    if req.options.is_empty() {
        return RankResponse {
            task_id: req.task_id.clone(),
            ranked_ids: vec![],
            scores: HashMap::new(),
        };
    }

    let min_price = req
        .options
        .iter()
        .map(|o| o.price)
        .fold(f64::INFINITY, f64::min);
    let max_price = req
        .options
        .iter()
        .map(|o| o.price)
        .fold(f64::NEG_INFINITY, f64::max);

    let price_range = (max_price - min_price).max(1e-6);

    let w_sum = req.weights.price + req.weights.convenience + req.weights.flexibility;
    let w_p = if w_sum > 0.0 { req.weights.price / w_sum } else { 0.33 };
    let w_c = if w_sum > 0.0 { req.weights.convenience / w_sum } else { 0.33 };
    let w_f = if w_sum > 0.0 { req.weights.flexibility / w_sum } else { 0.34 };

    let mut scored_options: Vec<(String, f64)> = req
        .options
        .iter()
        .map(|opt| {
            // Price score: 1.0 for cheapest, 0.0 for most expensive
            let normalized_price_score = 1.0 - ((opt.price - min_price) / price_range);

            let score = (normalized_price_score * w_p)
                + (opt.convenience_score.clamp(0.0, 1.0) * w_c)
                + (opt.flexibility_score.clamp(0.0, 1.0) * w_f);

            (opt.id.clone(), (score * 100.0).round() / 100.0)
        })
        .collect();

    // Sort by score descending
    scored_options.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

    let ranked_ids: Vec<String> = scored_options.iter().map(|(id, _)| id.clone()).collect();
    let scores: HashMap<String, f64> = scored_options.into_iter().collect();

    RankResponse {
        task_id: req.task_id.clone(),
        ranked_ids,
        scores,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rank_options_price_heavy() {
        let req = RankRequest {
            task_id: "t1".to_string(),
            options: vec![
                OptionItem {
                    id: "expensive".to_string(),
                    label: Some("Expensive Flight".to_string()),
                    price: 500.0,
                    convenience_score: 0.9,
                    flexibility_score: 0.9,
                },
                OptionItem {
                    id: "cheap".to_string(),
                    label: Some("Cheap Flight".to_string()),
                    price: 200.0,
                    convenience_score: 0.5,
                    flexibility_score: 0.5,
                },
            ],
            weights: RankingWeights {
                price: 0.8,
                convenience: 0.1,
                flexibility: 0.1,
            },
        };

        let res = rank_options(&req);
        assert_eq!(res.ranked_ids[0], "cheap");
    }

    #[test]
    fn test_rank_options_convenience_heavy() {
        let req = RankRequest {
            task_id: "t2".to_string(),
            options: vec![
                OptionItem {
                    id: "direct".to_string(),
                    label: Some("Direct Flight".to_string()),
                    price: 480.0,
                    convenience_score: 0.95,
                    flexibility_score: 0.8,
                },
                OptionItem {
                    id: "layover".to_string(),
                    label: Some("2 Layovers".to_string()),
                    price: 440.0,
                    convenience_score: 0.40,
                    flexibility_score: 0.5,
                },
            ],
            weights: RankingWeights {
                price: 0.1,
                convenience: 0.8,
                flexibility: 0.1,
            },
        };

        let res = rank_options(&req);
        assert_eq!(res.ranked_ids[0], "direct");
    }
}
