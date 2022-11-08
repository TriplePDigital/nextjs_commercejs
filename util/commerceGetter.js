const commerceGetter = url => fetch(url).then(r => r.json())

export default commerceGetter