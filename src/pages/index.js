
import Head from 'next/head'
import { useState } from 'react'
import jsPDF from 'jspdf'

const items = [
  { id: 1, text: "나는 집단의 특성과 가치를 잘 나타내는 사람이다.", category: "정체성 원형성" },
  { id: 2, text: "나는 집단의 이상적인 구성원처럼 보일 것이다.", category: "정체성 원형성" },
  { id: 3, text: "나는 구성원들이 중요시 여기는 특성을 잘 보여준다.", category: "정체성 원형성" },
  { id: 4, text: "나는 구성원들이 생각하는 ‘우리’의 이미지를 잘 구현하고 있다.", category: "정체성 원형성" },
  { id: 5, text: "나를 보면 그 집단이 어떤 집단인지 쉽게 알 수 있을 것이다.", category: "정체성 원형성" },
  { id: 6, text: "나는 집단의 이익과 목표를 위해 앞장서서 행동한다.", category: "정체성 증진성" },
  { id: 7, text: "나는 우리 집단의 이익을 위해 외부의 위협에 맞선다.", category: "정체성 증진성" },
  { id: 8, text: "나는 늘 집단 전체의 이익을 중심으로 판단하고 행동한다.", category: "정체성 증진성" },
  { id: 9, text: "나는 구성원들이 중요하게 여기는 사안들을 대변한다.", category: "정체성 증진성" },
  { id: 10, text: "나는 집단의 장애물을 제거하고 성공을 돕기 위해 노력한다.", category: "정체성 증진성" },
  { id: 11, text: "나는 구성원들이 ‘하나의 우리’라는 느낌을 갖도록 한다.", category: "정체성 창출성" },
  { id: 12, text: "나는 구성원 간의 소속감과 정체성을 만들어낸다.", category: "정체성 창출성" },
  { id: 13, text: "나는 우리 집단의 가치와 규범을 명확히 정의하고 전달한다.", category: "정체성 창출성" },
  { id: 14, text: "나는 ‘우리가 누구인지’에 대한 인식을 구성원들과 함께 만든다.", category: "정체성 창출성" },
  { id: 15, text: "나는 다양한 배경의 사람들을 하나의 공동체로 엮어낸다.", category: "정체성 창출성" }
]

const categoryLabels = {
  "정체성 원형성": "그룹의 특성을 대표하고 전형성을 잘 체현하는 정도",
  "정체성 증진성": "그룹의 이익을 위해 행동하고 옹호하는 정도",
  "정체성 창출성": "그룹의 정체성과 소속감을 창출하고 강화하는 정도"
}

const interpretScore = (avg) => {
  const val = parseFloat(avg)
  if (val <= 3.0) return "낮은 수준"
  if (val <= 4.0) return "높은 수준"
  return "매우 높은 수준"
}

export default function Home() {
  const [result, setResult] = useState(null)

  const handleSubmit = () => {
    const scores = {}, total = []
    for (const item of items) {
      const val = document.querySelector(`input[name="q${item.id}"]:checked`)
      if (!val) return alert("모든 문항에 응답해 주세요.")
      const score = parseFloat(val.value)
      if (!scores[item.category]) scores[item.category] = []
      scores[item.category].push(score)
      total.push(score)
    }
    const summaries = Object.entries(scores).map(([cat, list]) => {
      const avg = (list.reduce((a,b)=>a+b,0)/list.length).toFixed(2)
      return { cat, avg, desc: categoryLabels[cat], level: interpretScore(avg) }
    })
    const totalAvg = (total.reduce((a,b)=>a+b,0)/total.length).toFixed(2)
    setResult({ summaries, totalAvg, level: interpretScore(totalAvg) })
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text("리더 정체성 설문 결과", 20, 20)
    doc.text(`전체 평균 점수: ${result.totalAvg} (${result.level})`, 20, 30)
    let y = 40
    result.summaries.forEach(({cat, avg, desc, level}) => {
      doc.text(`[${cat}] ${desc}`, 20, y)
      y += 7
      doc.text(`→ 평균 점수: ${avg} (${level})`, 25, y)
      y += 10
    })
    doc.save("설문결과.pdf")
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Head><title>리더 정체성 설문</title></Head>
      <h1 className="text-2xl font-bold mb-4">리더 정체성 설문</h1>
      {!result ? (
        <>
          {items.map((item) => (
            <div key={item.id} className="mb-4">
              <p className="font-semibold">[{item.category}] {item.text}</p>
              {[1,2,3,4,5].map(v => (
                <label key={v} className="mr-2"><input type="radio" name={`q${item.id}`} value={v} className="mr-1"/>{v}</label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">설문 결과 보기</button>
        </>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">설문 결과</h2>
          <p>전체 평균 점수: <strong>{result.totalAvg}</strong> ({result.level})</p>
          {result.summaries.map(({cat, avg, desc, level}) => (
            <div key={cat} className="mt-4">
              <h3 className="font-semibold">{cat}</h3>
              <p>{desc}</p>
              <p>→ 평균 점수: <strong>{avg}</strong> ({level})</p>
            </div>
          ))}
          <button onClick={handleDownload} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">PDF로 저장</button>
        </div>
      )}
    </div>
  )
}
