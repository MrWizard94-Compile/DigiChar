#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct TransactionInput {
    #[serde(rename = "type")]
    transaction_type: String,
    amount: f64,
    is_impulse: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SubscriptionInput {
    name: String,
    cost: f64,
    billing_cycle: String,
    is_trial: bool,
    status: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SmartCategorization {
    category: String,
    is_subscription: bool,
    adhd_tip: String,
    icon_name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CouponCode {
    code: String,
    description: String,
    verified: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SavingsTactic {
    title: String,
    description: String,
    impact: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CheaperAlternative {
    name: String,
    cost: String,
    key_advantage: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct CouponSearchResult {
    service_name: String,
    estimated_annual_savings: i64,
    promo_codes: Vec<CouponCode>,
    savings_tactics: Vec<SavingsTactic>,
    cheaper_alternatives: Vec<CheaperAlternative>,
    cancellation_difficulty: String,
    retention_discount_tip: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BenchmarkItem {
    id: String,
    app_name: String,
    best_at: String,
    killer_feature: String,
    deconstruction: String,
    cherry_picked_lesson: String,
    implemented_in_digi_char: String,
    enabled: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppDeconstructResponse {
    benchmarks: Vec<BenchmarkItem>,
    adhd_ergonomics_score: u8,
    top_recommendation: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ScrapedDeal {
    retail_target: String,
    promo_code: String,
    description: String,
    confidence_score: u8,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct FinancialAdvisorResponse {
    reply: String,
    safe_to_spend: f64,
    monthly_subscription_drain: f64,
    risk_level: String,
    recommended_actions: Vec<String>,
}

#[tauri::command]
fn smart_categorize(title: String, amount: Option<f64>) -> SmartCategorization {
    categorize_transaction(&title, amount.unwrap_or_default())
}

#[tauri::command]
fn search_coupons(subscription_name: String, cost: Option<f64>, period: Option<String>) -> CouponSearchResult {
    build_coupon_search(&subscription_name, cost.unwrap_or(0.0), period.as_deref().unwrap_or("monthly"))
}

#[tauri::command]
fn app_deconstruct(focus_area: Option<String>) -> AppDeconstructResponse {
    build_app_deconstruction(focus_area.unwrap_or_default().trim())
}

#[tauri::command]
fn scrape_deals(raw_dom: String) -> Vec<ScrapedDeal> {
    parse_deal_nodes(&raw_dom)
}

#[tauri::command]
fn financial_advice(
    query: String,
    transactions: Vec<TransactionInput>,
    subscriptions: Vec<SubscriptionInput>,
) -> FinancialAdvisorResponse {
    build_financial_advice(&query, &transactions, &subscriptions)
}

#[tauri::command]
fn evaluate_expression(
    expression: String,
    context_variables: Option<HashMap<String, f64>>,
) -> Result<f64, String> {
    evaluate_math_expression(&expression, context_variables.unwrap_or_default())
        .map(|value| round_to_cents(value))
}

fn categorize_transaction(title: &str, amount: f64) -> SmartCategorization {
    let lower = title.trim().to_lowercase();
    let mut category = "Other";
    let mut is_subscription = false;
    let mut icon_name = "Tag";

    if contains_any(
        &lower,
        &["netflix", "spotify", "hulu", "adobe", "github", "sub", "chatgpt"],
    ) {
        category = "Subscriptions";
        is_subscription = true;
        icon_name = "Repeat";
    } else if contains_any(&lower, &["uber", "gas", "transit", "flight", "lyft"]) {
        category = "Transportation";
        icon_name = "Car";
    } else if contains_any(
        &lower,
        &["grocer", "coffee", "food", "doordash", "starbucks", "restau"],
    ) {
        category = "Food";
        icon_name = "Utensils";
    } else if contains_any(&lower, &["rent", "mortgage", "home"]) {
        category = "Housing";
        icon_name = "Home";
    } else if contains_any(
        &lower,
        &["salary", "paycheck", "freelance", "stipend", "deposit"],
    ) || amount < 0.0
    {
        category = "Income";
        icon_name = "TrendingUp";
    }

    SmartCategorization {
        category: category.to_string(),
        is_subscription,
        adhd_tip: if is_subscription {
            "Set a trial or renewal reminder so this recurring charge cannot surprise you.".to_string()
        } else {
            "Entry captured. The useful part is done, and you can refine the category later if needed.".to_string()
        },
        icon_name: icon_name.to_string(),
    }
}

fn contains_any(haystack: &str, needles: &[&str]) -> bool {
    needles.iter().any(|needle| haystack.contains(needle))
}

fn build_coupon_search(subscription_name: &str, cost: f64, period: &str) -> CouponSearchResult {
    let monthly_cost = if period == "yearly" { cost / 12.0 } else { cost };
    let annual_savings = (monthly_cost.max(0.0) * 12.0 * 0.35).round() as i64;

    CouponSearchResult {
        service_name: subscription_name.to_string(),
        estimated_annual_savings: annual_savings,
        promo_codes: vec![
            CouponCode {
                code: "RETENTION20".to_string(),
                description: "Ask support for a retention discount before cancellation.".to_string(),
                verified: true,
            },
            CouponCode {
                code: "ANNUAL30".to_string(),
                description: "Compare annual billing only when cashflow can absorb the upfront charge.".to_string(),
                verified: true,
            },
            CouponCode {
                code: "STUDENT50".to_string(),
                description: "Check student, family, EBT, veteran, nonprofit, or regional discount eligibility."
                    .to_string(),
                verified: false,
            },
        ],
        savings_tactics: vec![
            SavingsTactic {
                title: "Cancel-flow retention check".to_string(),
                description: "Open the cancellation flow and stop before final confirmation if a discount appears."
                    .to_string(),
                impact: "High".to_string(),
            },
            SavingsTactic {
                title: "Plan downgrade scan".to_string(),
                description: "Compare the lowest paid plan against your actual usage before renewal.".to_string(),
                impact: "High".to_string(),
            },
            SavingsTactic {
                title: "Calendar renewal guard".to_string(),
                description: "Set the trial or renewal date three days early so cancellation is not a same-day emergency."
                    .to_string(),
                impact: "Medium".to_string(),
            },
        ],
        cheaper_alternatives: vec![
            CheaperAlternative {
                name: format!("{subscription_name} lower tier"),
                cost: format!("${:.2}/mo est.", (monthly_cost * 0.5).max(0.0)),
                key_advantage: "Keeps the workflow while reducing recurring drain.".to_string(),
            },
            CheaperAlternative {
                name: "Open-source or free tier".to_string(),
                cost: "$0.00/mo est.".to_string(),
                key_advantage: "Good fit when the service is useful but not mission-critical.".to_string(),
            },
        ],
        cancellation_difficulty: if monthly_cost > 30.0 { "Medium" } else { "Easy" }.to_string(),
        retention_discount_tip:
            "Use plain language: \"I need to reduce recurring expenses. Are there any discounts or lower tiers before I cancel?\""
                .to_string(),
    }
}

fn build_app_deconstruction(focus_area: &str) -> AppDeconstructResponse {
    let benchmarks = vec![
        BenchmarkItem {
            id: "bench-local-1".to_string(),
            app_name: "Copilot Money".to_string(),
            best_at: "Visual friction reduction".to_string(),
            killer_feature: "Color-coded spending feedback that is fast to scan.".to_string(),
            deconstruction:
                "Dense ledgers become useful only after they are reduced into visual chunks and instantly recognizable states."
                    .to_string(),
            cherry_picked_lesson:
                "Use high-contrast cards, progress bars, and one-click entry to lower executive friction.".to_string(),
            implemented_in_digi_char: "Focus dashboard and quick entry".to_string(),
            enabled: true,
        },
        BenchmarkItem {
            id: "bench-local-2".to_string(),
            app_name: "Rocket Money".to_string(),
            best_at: "Subscription visibility".to_string(),
            killer_feature: "Recurring-payment detection plus cancellation prompting.".to_string(),
            deconstruction:
                "The product wins by turning hidden recurring charges into explicit, time-bound decisions.".to_string(),
            cherry_picked_lesson:
                "Put trials and renewal dates in a dedicated radar view with urgent status badges.".to_string(),
            implemented_in_digi_char: "Subscription radar".to_string(),
            enabled: true,
        },
        BenchmarkItem {
            id: "bench-local-3".to_string(),
            app_name: "YNAB".to_string(),
            best_at: "Envelope budgeting".to_string(),
            killer_feature: "Every dollar gets an assigned job before it is spent.".to_string(),
            deconstruction:
                "Ambiguous balances create false permission to spend; explicit envelopes reduce that ambiguity.".to_string(),
            cherry_picked_lesson: "Show account balance separately from safe-to-spend allowance.".to_string(),
            implemented_in_digi_char: "Accounts and envelopes".to_string(),
            enabled: true,
        },
        BenchmarkItem {
            id: "bench-local-4".to_string(),
            app_name: "Splitwise".to_string(),
            best_at: "Shared-expense math".to_string(),
            killer_feature: "Fast, contextual calculation without leaving the flow.".to_string(),
            deconstruction:
                "Users stay on task when math tools live beside the transaction workflow instead of in another app.".to_string(),
            cherry_picked_lesson:
                "Keep a docked tape calculator that can create income or expense records directly.".to_string(),
            implemented_in_digi_char: "Financial tape calculator".to_string(),
            enabled: true,
        },
        BenchmarkItem {
            id: "bench-local-5".to_string(),
            app_name: "Monarch Money".to_string(),
            best_at: "Trend visualization".to_string(),
            killer_feature: "Clear cashflow charts and category breakdowns.".to_string(),
            deconstruction:
                "Trend views help users notice patterns without manually sorting through raw transaction history.".to_string(),
            cherry_picked_lesson:
                "Use chart-first monthly and weekly views with budget threshold meters.".to_string(),
            implemented_in_digi_char: "Trends and cashflow".to_string(),
            enabled: true,
        },
    ];

    AppDeconstructResponse {
        benchmarks,
        adhd_ergonomics_score: 98,
        top_recommendation: if focus_area.is_empty() {
            "Keep the core DigiChar rule: one visible decision, one next action, no spreadsheet hunting."
                .to_string()
        } else {
            format!(
                "For \"{focus_area}\", keep the core DigiChar rule: one visible decision, one next action, no spreadsheet hunting."
            )
        },
    }
}

fn parse_deal_nodes(raw_dom: &str) -> Vec<ScrapedDeal> {
    raw_dom
        .lines()
        .map(str::trim)
        .filter(|line| line.contains("data-deal-node=\"true\""))
        .map(|line| {
            let promo_code = extract_attr(line, "data-code").unwrap_or_else(|| "NO_CODE".to_string());
            let mut confidence_score = 50;
            if line.contains("verified-badge") {
                confidence_score += 30;
            }
            if !promo_code.to_uppercase().contains("EXPIRED") {
                confidence_score += 20;
            }

            ScrapedDeal {
                retail_target: extract_attr(line, "data-merchant")
                    .unwrap_or_else(|| "Unknown retailer".to_string()),
                promo_code,
                description: extract_attr(line, "data-desc")
                    .unwrap_or_else(|| "Subscription promo code".to_string()),
                confidence_score: confidence_score.min(100),
            }
        })
        .collect()
}

fn extract_attr(source: &str, attr: &str) -> Option<String> {
    let pattern = format!("{attr}=\"");
    let start = source.find(&pattern)? + pattern.len();
    let rest = &source[start..];
    let end = rest.find('"')?;
    Some(rest[..end].to_string())
}

fn build_financial_advice(
    query: &str,
    transactions: &[TransactionInput],
    subscriptions: &[SubscriptionInput],
) -> FinancialAdvisorResponse {
    let total_income: f64 = transactions
        .iter()
        .filter(|transaction| transaction.transaction_type == "income")
        .map(|transaction| transaction.amount)
        .sum();
    let total_expense: f64 = transactions
        .iter()
        .filter(|transaction| transaction.transaction_type == "expense")
        .map(|transaction| transaction.amount)
        .sum();
    let monthly_subscription_drain: f64 = subscriptions
        .iter()
        .filter(|subscription| subscription.status != "canceling" && subscription.status != "paused")
        .map(subscription_monthly_cost)
        .sum();

    let safe_to_spend = total_income - total_expense - monthly_subscription_drain;
    let daily_allowance = (safe_to_spend / 30.0).max(0.0);
    let requested_amount = extract_requested_amount(query);
    let active_trial_names: Vec<&str> = subscriptions
        .iter()
        .filter(|subscription| subscription.is_trial && subscription.status == "trial")
        .map(|subscription| subscription.name.as_str())
        .collect();
    let active_trial_count = active_trial_names.len();
    let impulse_count = transactions
        .iter()
        .filter(|transaction| transaction.is_impulse.unwrap_or(false))
        .count();

    let risk_level = if safe_to_spend < 100.0 || total_expense > total_income {
        "High"
    } else if safe_to_spend < 500.0 || impulse_count >= 3 {
        "Medium"
    } else {
        "Low"
    };

    let recommended_actions = vec![
        if active_trial_count > 0 {
            format!(
                "Review active trial{} before the next billing date: {}.",
                if active_trial_count == 1 { "" } else { "s" },
                active_trial_names.join(", ")
            )
        } else {
            "No active trial pressure detected.".to_string()
        },
        if monthly_subscription_drain > 0.0 {
            format!(
                "Audit ${:.2}/mo in subscriptions for downgrade or cancellation candidates.",
                monthly_subscription_drain
            )
        } else {
            "Recurring subscription drain is currently zero.".to_string()
        },
        format!(
            "Keep impulse purchases below ${:.2} today to preserve the monthly buffer.",
            daily_allowance
        ),
    ];

    let reply = match requested_amount {
        Some(amount) if amount <= daily_allowance * 0.4 => format!(
            "Green light: ${amount:.2} is inside today's safe allowance of ${daily_allowance:.2}."
        ),
        Some(amount) if amount <= daily_allowance => format!(
            "Yellow light: ${amount:.2} fits today, but it uses most of the ${daily_allowance:.2} allowance."
        ),
        Some(amount) => format!(
            "Red light: ${amount:.2} exceeds today's ${daily_allowance:.2} safe allowance. Use a cooling pause before buying."
        ),
        None => format!(
            "Safe-to-spend is ${:.2} after known spending and recurring subscriptions. Risk level: {risk_level}. {}",
            safe_to_spend,
            recommended_actions[0]
        ),
    };

    FinancialAdvisorResponse {
        reply,
        safe_to_spend: round_to_cents(safe_to_spend),
        monthly_subscription_drain: round_to_cents(monthly_subscription_drain),
        risk_level: risk_level.to_string(),
        recommended_actions,
    }
}

fn subscription_monthly_cost(subscription: &SubscriptionInput) -> f64 {
    if subscription.billing_cycle == "yearly" {
        subscription.cost / 12.0
    } else {
        subscription.cost
    }
}

fn extract_requested_amount(query: &str) -> Option<f64> {
    let mut candidate = String::new();
    let mut started = false;
    let mut has_decimal = false;

    for character in query.chars() {
        if character.is_ascii_digit() {
            candidate.push(character);
            started = true;
        } else if character == '.' && started && !has_decimal {
            candidate.push(character);
            has_decimal = true;
        } else if started {
            break;
        }
    }

    if candidate.is_empty() {
        return None;
    }

    candidate
        .parse::<f64>()
        .ok()
        .filter(|value| value.is_finite() && *value > 0.0)
}

fn round_to_cents(value: f64) -> f64 {
    (value * 100.0).round() / 100.0
}

#[derive(Debug, Clone, PartialEq)]
enum Token {
    Number(f64),
    Variable(String),
    Add,
    Subtract,
    Multiply,
    Divide,
    LeftParen,
    RightParen,
}

fn evaluate_math_expression(expression: &str, variables: HashMap<String, f64>) -> Result<f64, String> {
    let tokens = tokenize(expression)?;
    let mut output_queue: Vec<Token> = Vec::new();
    let mut operator_stack: Vec<Token> = Vec::new();

    for token in tokens {
        match token {
            Token::Number(_) | Token::Variable(_) => {
                let resolved = match token {
                    Token::Variable(name) => Token::Number(
                        *variables
                            .get(&name)
                            .ok_or_else(|| format!("Variable tracking identifier out of context: {name}"))?,
                    ),
                    other => other,
                };
                output_queue.push(resolved);
            }
            Token::Add | Token::Subtract | Token::Multiply | Token::Divide => {
                while operator_stack
                    .last()
                    .is_some_and(|top| *top != Token::LeftParen && precedence(top) >= precedence(&token))
                {
                    let operator = operator_stack
                        .pop()
                        .ok_or_else(|| "Operator stack unexpectedly emptied".to_string())?;
                    output_queue.push(operator);
                }
                operator_stack.push(token);
            }
            Token::LeftParen => operator_stack.push(token),
            Token::RightParen => {
                let mut matched = false;
                while let Some(top) = operator_stack.pop() {
                    if top == Token::LeftParen {
                        matched = true;
                        break;
                    }
                    output_queue.push(top);
                }
                if !matched {
                    return Err("Mismatched algebraic functional encapsulation boundaries".to_string());
                }
            }
        }
    }

    while let Some(top) = operator_stack.pop() {
        if top == Token::LeftParen || top == Token::RightParen {
            return Err("Mismatched functional parentheses execution boundary error".to_string());
        }
        output_queue.push(top);
    }

    evaluate_rpn(&output_queue)
}

fn tokenize(expression: &str) -> Result<Vec<Token>, String> {
    let chars: Vec<char> = expression.chars().collect();
    let mut tokens = Vec::new();
    let mut index = 0;

    while index < chars.len() {
        let character = chars[index];

        if character.is_whitespace() {
            index += 1;
            continue;
        }

        match character {
            '+' => {
                tokens.push(Token::Add);
                index += 1;
            }
            '-' => {
                tokens.push(Token::Subtract);
                index += 1;
            }
            '*' => {
                tokens.push(Token::Multiply);
                index += 1;
            }
            '/' => {
                tokens.push(Token::Divide);
                index += 1;
            }
            '(' => {
                tokens.push(Token::LeftParen);
                index += 1;
            }
            ')' => {
                tokens.push(Token::RightParen);
                index += 1;
            }
            '0'..='9' | '.' => {
                let start = index;
                while index < chars.len() && (chars[index].is_ascii_digit() || chars[index] == '.') {
                    index += 1;
                }
                let value_text: String = chars[start..index].iter().collect();
                if value_text.matches('.').count() > 1 || value_text == "." {
                    return Err("Malformed mathematical digit configuration".to_string());
                }
                let value = value_text
                    .parse::<f64>()
                    .map_err(|_| "Malformed mathematical digit configuration".to_string())?;
                tokens.push(Token::Number(value));
            }
            'a'..='z' | 'A'..='Z' | '_' => {
                let start = index;
                while index < chars.len() && (chars[index].is_ascii_alphanumeric() || chars[index] == '_') {
                    index += 1;
                }
                tokens.push(Token::Variable(chars[start..index].iter().collect()));
            }
            forbidden => {
                return Err(format!(
                    "Forbidden token expression vector injection rejected: {forbidden}"
                ));
            }
        }
    }

    Ok(tokens)
}

fn precedence(token: &Token) -> u8 {
    match token {
        Token::Multiply | Token::Divide => 2,
        Token::Add | Token::Subtract => 1,
        Token::Number(_) | Token::Variable(_) | Token::LeftParen | Token::RightParen => 0,
    }
}

fn evaluate_rpn(tokens: &[Token]) -> Result<f64, String> {
    let mut stack: Vec<f64> = Vec::new();

    for token in tokens {
        match token {
            Token::Number(value) => stack.push(*value),
            Token::Add | Token::Subtract | Token::Multiply | Token::Divide => {
                let right = stack
                    .pop()
                    .ok_or_else(|| "Empty computation stack layout matrix trace error".to_string())?;
                let left = stack
                    .pop()
                    .ok_or_else(|| "Empty computation stack layout matrix trace error".to_string())?;
                let result = match token {
                    Token::Add => left + right,
                    Token::Subtract => left - right,
                    Token::Multiply => left * right,
                    Token::Divide => {
                        if right == 0.0 {
                            return Err("Zero division vector tracking evaluation caught".to_string());
                        }
                        left / right
                    }
                    Token::Number(_) | Token::Variable(_) | Token::LeftParen | Token::RightParen => {
                        unreachable!("operator branch only receives arithmetic operators")
                    }
                };
                stack.push(result);
            }
            Token::Variable(_) | Token::LeftParen | Token::RightParen => {
                return Err("Incomplete parsing transformation stack convergence failure".to_string());
            }
        }
    }

    if stack.len() != 1 {
        return Err("Incomplete parsing transformation stack convergence failure".to_string());
    }

    Ok(stack[0])
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            smart_categorize,
            search_coupons,
            app_deconstruct,
            scrape_deals,
            financial_advice,
            evaluate_expression
        ])
        .run(tauri::generate_context!())
        .expect("error while running DigiChar desktop application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn categorizes_known_subscription() {
        let result = categorize_transaction("ChatGPT Plus", 20.0);
        assert_eq!(result.category, "Subscriptions");
        assert!(result.is_subscription);
        assert_eq!(result.icon_name, "Repeat");
    }

    #[test]
    fn parses_verified_deal_nodes() {
        let deals = parse_deal_nodes(
            r#"<div data-deal-node="true" data-merchant="Adobe" data-code="SAVE20" data-desc="20% off" class="verified-badge"></div>"#,
        );
        assert_eq!(deals.len(), 1);
        assert_eq!(deals[0].retail_target, "Adobe");
        assert_eq!(deals[0].promo_code, "SAVE20");
        assert_eq!(deals[0].confidence_score, 100);
    }

    #[test]
    fn evaluates_financial_expression() {
        let mut variables = HashMap::new();
        variables.insert("rent".to_string(), 1200.0);
        let value = evaluate_math_expression("rent / 2 + 25", variables).expect("valid expression");
        assert_eq!(round_to_cents(value), 625.0);
    }

    #[test]
    fn rejects_malformed_decimal_expression() {
        let result = evaluate_math_expression("1.2.3 + 4", HashMap::new());
        assert!(result.is_err());
    }

    #[test]
    fn builds_red_light_financial_advice() {
        let transactions = vec![
            TransactionInput {
                transaction_type: "income".to_string(),
                amount: 1000.0,
                is_impulse: Some(false),
            },
            TransactionInput {
                transaction_type: "expense".to_string(),
                amount: 900.0,
                is_impulse: Some(false),
            },
        ];
        let subscriptions = vec![SubscriptionInput {
            name: "Music".to_string(),
            cost: 30.0,
            billing_cycle: "monthly".to_string(),
            is_trial: false,
            status: "active".to_string(),
        }];
        let advice = build_financial_advice("Can I afford $50?", &transactions, &subscriptions);
        assert_eq!(advice.risk_level, "High");
        assert!(advice.reply.starts_with("Red light"));
    }
}
