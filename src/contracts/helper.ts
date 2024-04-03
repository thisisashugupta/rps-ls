import RPS from './RPS.json'

// Matches the input data of a transaction to a RockPaperScissors contract bytecode
export const isRPSContractTx = (inputData: string) => {
    return inputData.startsWith(RPS.bytecode.object)
}