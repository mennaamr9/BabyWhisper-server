module.exports = function calculateAgeInMonths(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const now = new Date();
  
    let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += now.getMonth();
  
    if (now.getDate() < birthDate.getDate()) {
      months -= 1;
    }
  
    return months <= 0 ? 0 : months;
  };
  