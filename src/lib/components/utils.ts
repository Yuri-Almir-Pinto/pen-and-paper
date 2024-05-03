export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

export function assertUnreachable(x: never): never {
    const exhaustiveCheck: never = x;
    throw new Error(`Unhandled actionType case: ${exhaustiveCheck}`);
}