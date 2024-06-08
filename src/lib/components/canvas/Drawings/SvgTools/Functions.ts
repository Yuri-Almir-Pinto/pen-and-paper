
export function toColor(color: string | number) {
    return typeof color === "number" ? color.toString(16) : color;
}

export function toPath(path: number[]): string {
    if (path.length % 2 !== 0 || path.length === 0)
        return "";

    let returnString = `M${path[0]} ${path[1]} `;

    for (let i = 2; i < path.length; i++) {
        if (i % 2 === 0)
            returnString += `L${path[i]} `
        else
            returnString += `${path[i]} `
    }

    returnString += "Z";

    return returnString;
}