const API_BASE = "https://api.skilla.ru"

async function apiPost(endpoint, queryParams = {}) {
    const queryString = new URLSearchParams(
        Object.fromEntries(
            // eslint-disable-next-line no-unused-vars
            Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== "")
        )
    ).toString()

    const url = `${API_BASE}${endpoint}${queryString ? `?${queryString}` : ""}`

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            "Content-Type": "application/json"
        }
    })

    if (!res.ok) {
        throw new Error(`Ошибка API: ${res.status} ${res.statusText}`)
    }

    return await res.json()
}

export async function getCalls({
    date_start,
    date_end,
    in_out, // 1 - входящие, 0 - исходящие, "" - все
    sort_by, // date | duration
    order, // ASC | DESC
    offset,
    limit = 50,
}) {

    return apiPost("/mango/getList", {
        date_start,
        date_end,
        in_out,
        sort_by,
        order,
        offset,
        limit,
    })
}

export async function getCallRecord(recordId, partnershipId) {
    const url = `${API_BASE}/mango/getRecord?record=${recordId}&partnership_id=${partnershipId}`

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`
        }
    })

    if (!res.ok) {
        throw new Error(`Ошибка получения записи: ${res.status}`)
    }

    return await res.blob()
}