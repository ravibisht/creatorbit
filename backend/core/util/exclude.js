export function exclude(obj, ...fields) {
    if (!obj || !fields) return obj

    for (const key in obj) {
        delete obj[key]
    }

    return obj
}
