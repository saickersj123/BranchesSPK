export function replacePlaceholders(responseTemplate: string, userInput: {
    name?: string;
    nights?: number;
    checkin_time?: string;
    floor?: number;
}): string {
    let response = responseTemplate;

    // {NAME} 처리 - 사용자의 이름 적용 (기본값: "Guest")
    response = response.replace(/{NAME}/g, userInput.name || "Guest");

    // {X} 처리 - 숙박 일수 적용 (기본값: 1, 범위: 1~7)
    const nights = userInput.nights && userInput.nights >= 1 && userInput.nights <= 7 ? userInput.nights : 1;
    response = response.replace(/{X}/g, nights.toString());

    // {Y} 처리 - 체크인 시간 적용 (기본값: 6PM)
    response = response.replace(/{Y}/g, userInput.checkin_time || "6");

    // {Room_number} 처리 - 특정 층에서 랜덤 방 배정
    const floor = userInput.floor && userInput.floor >= 1 && userInput.floor <= 7 ? userInput.floor : Math.floor(Math.random() * 7) + 1;
    const roomNumber = Math.floor(Math.random() * 10) + (floor * 100 + 1);
    response = response.replace(/{Room_number}/g, roomNumber.toString());

    return response;
}

