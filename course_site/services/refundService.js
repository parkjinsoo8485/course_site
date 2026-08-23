// 환불 일할/주할 및 분할 계산 서비스
function calculateRefundAmount(tuitionFee, totalDays = 20, attendedDays = 0) {
  const fee = parseInt(tuitionFee) || 0;
  const tot = parseInt(totalDays) || 20;
  const att = parseInt(attendedDays) || 0;

  if (att <= 0) return fee; // Before class starts: 100% refund
  if (att >= tot) return 0; // After all classes attended: 0% refund

  const ratio = att / tot;
  if (ratio <= 0.33) {
    // 1/3 경과 전: 2/3 환불
    return Math.floor((fee * 2) / 3);
  } else if (ratio <= 0.5) {
    // 1/2 경과 전: 1/2 환불
    return Math.floor(fee / 2);
  } else {
    // 1/2 경과 후: 환불 불가 (소비자분쟁해결기준)
    return 0;
  }
}

module.exports = {
  calculateRefundAmount
};
