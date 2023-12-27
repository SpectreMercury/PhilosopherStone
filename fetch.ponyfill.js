function customFetch(request, init) {
  return fetch(request, {
    ...init,
    next: {
      revalidate: false,
      cache: 'no-store',
    },
  });
}

module.exports = exports = customFetch;
exports.fetch = customFetch;