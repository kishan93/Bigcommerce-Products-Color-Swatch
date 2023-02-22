export default async (query, variables) => {
    const graphQLUrl = `/graphql`;

    const res = await fetch(graphQLUrl, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.STENCIL_API_TOKEN}`
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    return json.data;
}