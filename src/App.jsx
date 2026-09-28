import { useMemo, useState } from 'react'
import baseScenes from './data/phrases.json'
import extraPhrases from './data/extraPhrases.json'

const scenes = baseScenes.map((scene) => ({
  ...scene,
  phrases: [...scene.phrases, ...extraPhrases[scene.id]],
}))

const tabs = [
  { id: 'phrase', label: 'フレーズ', icon: '◫' },
  { id: 'talk', label: '会話練習', icon: '◌' },
  { id: 'quiz', label: 'クイズ', icon: '?' },
]

function Progress({ completed }) {
  return <div className="progress-track" aria-label={`学習済み ${completed} / 8`}><span style={{ width: `${(completed / scenes.length) * 100}%` }} /></div>
}

export default function App() {
  const [sceneId, setSceneId] = useState('airport')
  const [tab, setTab] = useState('phrase')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [completed, setCompleted] = useState([])
  const scene = useMemo(() => scenes.find((item) => item.id === sceneId), [sceneId])
  const phrase = scene.phrases[phraseIndex]

  const changeScene = (id) => {
    setSceneId(id)
    setPhraseIndex(0)
    setAnswer(null)
  }
  const markDone = () => setCompleted((items) => items.includes(scene.id) ? items : [...items, scene.id])
  const chooseAnswer = (index) => {
    if (answer !== null) return
    setAnswer(index)
    if (index === scene.quiz.answer) markDone()
  }

  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="brand"><span className="brand-mark">✈</span><span>旅のひとこと英語</span></div>
        <button className="profile" aria-label="学習プロフィール">●</button>
      </header>

      <section className="welcome">
        <div className="welcome-copy"><p>こんにちは、旅の準備をしよう</p><h1>今日のフレーズを<br />ひとつ覚えよう。</h1></div>
        <div className="passport-stamp">BON<br /><strong>VOYAGE</strong></div>
      </section>

      <section className="journey-status" aria-label="学習の進み具合">
        <div><span>旅の準備</span><strong>{completed.length} / {scenes.length} シーン</strong></div>
        <Progress completed={completed.length} />
      </section>

      <section className="scene-picker" aria-label="学習シーン">
        {scenes.map((item) => <button key={item.id} onClick={() => changeScene(item.id)} className={`scene-chip ${sceneId === item.id ? 'active' : ''}`} style={{ '--scene': item.color }}><i>{item.icon}</i><span>{item.shortTitle}</span></button>)}
      </section>

      <section className="current-scene" style={{ '--scene': scene.color }}>
        <div className="scene-heading"><span className="scene-icon">{scene.icon}</span><div><p>旅行シーン</p><h2>{scene.title}</h2><small>{scene.description}</small></div></div>
        <div className="tabs" role="tablist">
          {tabs.map((item) => <button key={item.id} onClick={() => { setTab(item.id); setAnswer(null) }} className={tab === item.id ? 'active' : ''} role="tab" aria-selected={tab === item.id}><b>{item.icon}</b>{item.label}</button>)}
        </div>

        {tab === 'phrase' && <div className="study-panel phrase-panel">
          <div className="card-top"><span>{phraseIndex + 1} / {scene.phrases.length}</span></div>
          <p className="japanese">{phrase.ja}</p>
          <p className="english">{phrase.en}</p>
          <p className="hint">{phrase.hint}</p>
          <div className="card-footer"><button className="text-button" onClick={() => setPhraseIndex((phraseIndex + scene.phrases.length - 1) % scene.phrases.length)}>← 前へ</button><button className="next-button" onClick={() => { const isLast = phraseIndex === scene.phrases.length - 1; setPhraseIndex((phraseIndex + 1) % scene.phrases.length); if (isLast) markDone() }}>次のフレーズ <span>→</span></button></div>
        </div>}

        {tab === 'talk' && <div className="study-panel dialogue-panel">
          <p className="panel-intro">会話の流れを聞いて、<br />自分のセリフを声に出してみよう。</p>
          <div className="dialogue-list">{scene.dialogue.map((line, index) => <div className={`line ${line.speaker === 'You' ? 'you' : ''}`} key={index}><div className="line-avatar">{line.speaker === 'You' ? 'YOU' : '●'}</div><div><span>{line.speaker === 'You' ? 'あなた' : '相手'}</span><p>{line.text}</p></div></div>)}</div>
          <button className="complete-button" onClick={markDone}>練習できた <span>✓</span></button>
        </div>}

        {tab === 'quiz' && <div className="study-panel quiz-panel">
          <p className="quiz-kicker">選択式クイズ</p><h3>{scene.quiz.question}</h3>
          <div className="choices">{scene.quiz.options.map((option, index) => { const state = answer === null ? '' : index === scene.quiz.answer ? 'correct' : index === answer ? 'wrong' : ''; return <button key={option} onClick={() => chooseAnswer(index)} className={state}><i>{String.fromCharCode(65 + index)}</i>{option}{state === 'correct' && <b>✓</b>}{state === 'wrong' && <b>×</b>}</button> })}</div>
          {answer !== null && <div className={`result ${answer === scene.quiz.answer ? 'correct' : 'wrong'}`}>{answer === scene.quiz.answer ? '正解！ このフレーズを旅で使ってみよう。' : `正解は「${scene.quiz.options[scene.quiz.answer]}」です。`}</div>}
        </div>}
      </section>

      <footer>オフラインでも使える、あなたの旅の英語メモ。</footer>
    </main>
  )
}
