export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    padding: '1px 10px'
  })
}

export const theme = (themeObj) => ({
  ...themeObj,
  colors: {
    ...themeObj.colors,
    neutral80: '#2f353a'
  },
})
