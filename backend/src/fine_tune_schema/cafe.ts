export const cafeOrderSchema = {
    "schema_version": "1.1",
    "description": "Schema for a conversational dataset used for cafe order handling.",
    "type": "object",
    "properties": {
        "conversation_id": {    //각 대화의 고유 식별자 (대화를 그룹화하는 데 유용).
            "type": "integer",
            "description": "Unique identifier for the conversation."
        },
        "message_id": {     //대화 내에서 각 메시지의 고유 식별자.
            "type": "integer",
            "description": "Unique identifier for each message within the conversation."
        },
        "role": {       //메시지를 보낸 사람의 역할 (user, assistant 등).
            "type": "string",
            "description": "Role of the participant in the conversation (e.g., 'user', 'assistant')."
        },
        "content": {    //메시지의 실제 텍스트.
            "type": "string",
            "description": "Actual text content of the message."
        },
        "intent": { //(Optional) 사용자가 표현한 의도를 캡처 (e.g., order_request, special_request, confirmation).

            "type": "string",
            "description": "The intent of the message (e.g., 'order_request', 'special_request').",
            "nullable": true
        },
        "entity": { //(Optional) 메시지에서 추출된 주요 개체 (e.g., Drink: Americano, Size: Medium).
            "type": "object",
            "description": "Entities extracted from the message (e.g., {'Drink': 'Americano', 'Size': 'Medium'}).",
            "nullable": true
        },
        "response_time": {  //(Optional) 이전 메시지와의 시간 간격.
            "type": "string",
            "format": "duration",
            "description": "Time taken between this message and the previous one.",
            "nullable": true
        },
        "order_details": {  //(Optional) 사용자가 명시적으로 요청한 주문 정보 (음료명, 크기, 추가 요청 등).
            "type": "object",
            "description": "Detailed order information extracted from the conversation.",
            "nullable": true
        },
        "completed": {  // (Optional) 주문이 완료되었는지 여부 (True/False).
            "type": "boolean",
            "description": "Indicates whether the order was successfully completed.",
            "nullable": true
        }
    },
    "required": ["conversation_id", "message_id", "role", "content"]
};
