import React from "react";

const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}
const Total = ({parts}) => {
  return (
    <p>
      <b>total of {
        parts.reduce((sum,part) => sum += part.exercises, 0)
        } exercises
      </b>
    </p>
  )
}
const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Course = ({ course }) => {
  //console.log(course);
  return (
    <section>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts ={course.parts} />
    </section>
  )
}

export default Course