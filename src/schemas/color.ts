import { gql } from "apollo-server-express"

const schema = gql`
  enum MaterialColor {
    red
    pink
    purple
    deepPurple
    indigo
    blue
    lightBlue
    cyan
    teal
    green
    lightGreen
    lime
    yellow
    amber
    orange
    deepOrange
    brown
    grey
    blueGrey
  }
`

export default schema

export enum IMaterialColor {
  RED = 'red',
  PINK = 'pink',
  PURPLE = 'purple',
  DEEP_PURPLE = 'deepPurple',
  INDIGO = 'indigo',
  BLUE = 'blue',
  LIGHT_BLUE = 'lightBlue',
  CYAN = 'cyan',
  TEAL = 'teal',
  GREEN  = 'green',
  LIGHT_GREEN = 'lightGreen',
  LIME  = 'lime',
  YELLOW = 'yellow',
  AMBER = 'amber',
  ORANGE = 'orange',
  DEEP_ORANGE = 'deepOrange',
  BROWN = 'brown',
  GREY = 'grey',
  BLUE_GREY = 'blueGrey'
}