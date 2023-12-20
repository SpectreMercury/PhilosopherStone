function customFetch(request, init) {
  console.log('customFetch', request);
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