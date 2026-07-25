import assert from 'node:assert/strict';
import {
  getLocalAppDeconstruction,
  getLocalCouponSearch,
  getLocalFinancialAdvice,
  getLocalSmartCategorization,
  scrapeDealsLocally,
} from '../src/services/desktopApi';
import { INITIAL_SUBSCRIPTIONS, INITIAL_TRANSACTIONS } from '../src/data/initialData';
import { ShuntingYardEngine } from '../src/engine/shuntingYard';

const category = getLocalSmartCategorization('ChatGPT Plus');
assert.equal(category.category, 'Subscriptions');
assert.equal(category.isSubscription, true);

const coupons = getLocalCouponSearch('Adobe Creative Cloud', 60, 'monthly');
assert.equal(coupons.serviceName, 'Adobe Creative Cloud');
assert.ok(coupons.estimatedAnnualSavings > 0);
assert.ok(coupons.promoCodes.some((code) => code.verified));

const deals = scrapeDealsLocally(
  '<div data-deal-node="true" data-merchant="Adobe" data-code="SAVE20" data-desc="20% off" class="verified-badge"></div>',
);
assert.equal(deals.length, 1);
assert.equal(deals[0].absoluteConfidenceScore, 100);

const advice = getLocalFinancialAdvice('Can I afford $150?', INITIAL_TRANSACTIONS, INITIAL_SUBSCRIPTIONS);
assert.match(advice.reply, /light/i);
assert.ok(Number.isFinite(advice.safeToSpend));

const deconstruction = getLocalAppDeconstruction('receipt scan');
assert.equal(deconstruction.adhdErgonomicsScore, 98);
assert.ok(deconstruction.benchmarks.length >= 5);

assert.equal(
  ShuntingYardEngine.evaluate('salary - rent - sub_drain', {
    salary: 3500,
    rent: 1200,
    sub_drain: 45,
  }),
  2255,
);
assert.throws(() => ShuntingYardEngine.evaluate('1.2.3 + 4'));

console.log('DigiChar smoke tests passed.');
