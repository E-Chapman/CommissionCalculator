import React, { useState } from "react";

interface CommissionBreakdown {
  range: string;
  rate: string;
  amount: number;
}

interface CommissionTotal {
  totalCommission: number;
  breakdown: CommissionBreakdown[];
}

const bands = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 10000, rate: 0.1 },
  { min: 10000, max: 15000, rate: 0.15 },
  { min: 15000, max: 20000, rate: 0.2 },
  { min: 20000, max: Infinity, rate: 0.25 },
];

const simulateAPICall = async (revenue: number) => {
  return new Promise<CommissionTotal>((resolve) => {
    setTimeout(() => {
      let totalCommission = 0;
      const breakdown: CommissionBreakdown[] = [];

      for (const commissionBand of bands) {
        const bandAmount = Math.min(
          revenue,
          commissionBand.max - commissionBand.min
        );
        const bandCommission = bandAmount * commissionBand.rate;
        totalCommission += bandCommission;
        breakdown.push({
          range: `${
            commissionBand.min === 0 ? "£0" : `£${commissionBand.min}`
          } - ${
            commissionBand.max === Infinity ? "The Moon" : commissionBand.max
          }`,
          rate: `${commissionBand.rate * 100}%`,
          amount: bandCommission,
        });
        revenue -= bandAmount;

        if (revenue <= 0) {
          break;
        }
      }

      resolve({ totalCommission, breakdown });
    }, 1000);
  });
};

const CommissionCalculator: React.FC = () => {
  const [revenue, setRevenue] = useState<string>("");
  const [commissionTotal, setCommissionTotal] =
    useState<CommissionTotal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateCommission = async () => {
    setLoading(true);

    const revenueValue = Number(revenue);

    if (!isNaN(revenueValue) && revenueValue >= 0) {
      try {
        const result = await simulateAPICall(revenueValue);
        setCommissionTotal(result);
      } catch (error) {
        console.error("Error in making request", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetValues = () => {
    setRevenue("");
    setCommissionTotal(null);
  };

  return (
    <>
      <div>
        <label htmlFor="revenue">£ </label>
        <input
          id="revenue"
          type="number"
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          aria-label="Revenue input"
          placeholder="Enter revenue"
        />
      </div>
      <button onClick={calculateCommission} disabled={!revenue || loading}>
        {loading ? "Calculating..." : "Calculate"}
      </button>
      <button onClick={resetValues}>Reset</button>
      {commissionTotal && (
        <>
          <h2>
            Total Commission: £{commissionTotal.totalCommission.toFixed(2)}
          </h2>
          <table>
            <caption>Breakdown by Band</caption>
            <thead>
              <tr>
                <th>Range</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {commissionTotal.breakdown.map((band, index) => (
                <tr key={index}>
                  <td>{band.range}</td>
                  <td>{band.rate}</td>
                  <td>£{band.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default CommissionCalculator;
