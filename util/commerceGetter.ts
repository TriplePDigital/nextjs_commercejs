const commerceGetter = (url: RequestInfo | URL) => fetch(url).then((r) => r.json())

export default commerceGetter
