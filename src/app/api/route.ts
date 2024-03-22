import { type NextRequest, NextResponse } from 'next/server';

let gameContract : string | null = null;

export function GET() {
    return NextResponse.json({ address: gameContract }, { status: 200 });
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body.game_contract_address) {
        console.log('game contract address is null');
    } else {
        gameContract = body.game_contract_address;
    }
    return NextResponse.json({ address: gameContract }, { status: 200 });
}