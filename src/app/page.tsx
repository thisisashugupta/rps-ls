import HowToPlay from '@/components/HowToPlay'
import GameRules from '@/components/GameRules'
import CreateOrPlay from '@/components/CreateOrPlay'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CreateOrPlay/>
      <HowToPlay/>
      <GameRules/>
    </main>
  );
}
