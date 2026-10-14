window.syncRepoFile = async ({ url, key, binary, apply }) => {
    try {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) return false;

        const content = binary ? await response.arrayBuffer() : await response.text();
        const bytes = binary ? new Uint8Array(content) : null;
        const length = binary ? bytes.length : content.length;
        let hash = 5381;
        for (let i = 0; i < length; i++) {
            hash = ((hash << 5) + hash + (binary ? bytes[i] : content.charCodeAt(i))) | 0;
        }

        const signature = `${length}:${hash}`;
        const signatureKey = `${key}:repo-signature`;
        if (localStorage.getItem(signatureKey) === signature) return false;

        // apply() returns false when the file has no usable data, so local data is kept.
        if ((await apply(content)) === false) return false;

        localStorage.setItem(signatureKey, signature);
        return true;
    } catch {
        return false;
    }
};
