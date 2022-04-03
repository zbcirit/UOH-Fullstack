import { useState } from 'react'

const Heading1 = ({ text }) => <h2>{text}</h2>


const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ props }) => {
  //console.log(props.good)
  if (props.all === 0) {
    return (
      <table>
        <tbody>
          <StatisticLine text='No feedback given' value='' />
        </tbody>
      </table>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={props.good} />
        <StatisticLine text='neutral' value={props.neutral} />
        <StatisticLine text='bad' value={props.bad} />
        <StatisticLine text='all' value={props.all} />
        <StatisticLine text='average' value={props.average()} />
        <StatisticLine text='positive' value={props.positive()} />
      </tbody>
    </table>
  )
}

const App = () => {

  //save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  const all = good + bad + neutral
  const average = () => {
    // if (all === 0) {
    //   return 0
    // }
    return (good - bad) / all
  }
  const positive = () => {
    // if (all === 0) {
    //   return 0 + '%'
    // }
    return 100 * good / all + '%'
  }

  const statsProps = { good, neutral, bad, all, average, positive }

  return (
    <>
      <Heading1 text={'give feedback'} />
      <Button onClick={incrementGood} text={'good'} />
      <Button onClick={incrementNeutral} text={'neutral'} />
      <Button onClick={incrementBad} text={'bad'} />
      <Heading1 text='statistics' />
      <Statistics props={statsProps} />
    </>
  )
}

export default App;
