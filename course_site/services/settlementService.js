// 에듀파인 연동 수용비(20%) 및 강사료(80%) 정산 서비스
function calculateFacilityFeeSplit(tuitionFee) {
  const fee = parseInt(tuitionFee) || 0;
  const facilityFee = Math.round(fee * 0.20);
  const instructorFee = fee - facilityFee;
  return {
    tuitionFee: fee,
    facilityFee,
    instructorFee
  };
}

module.exports = {
  calculateFacilityFeeSplit
};
