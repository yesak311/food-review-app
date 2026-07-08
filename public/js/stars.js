function renderStars(rating) {
  if (rating === null || rating === undefined) {
    return '<span class="card-meta">No ratings yet</span>';
  }
  const num = Number(rating);
  const full = Math.round(num);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return `<span class="rating-badge"><span class="stars">${stars}</span> ${num.toFixed(1)}</span>`;
}
