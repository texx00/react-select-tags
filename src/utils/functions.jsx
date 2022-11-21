export function filter(options, keyword) {
  keyword = keyword.toLowerCase();

  return options.filter(opt => {
    console.log(opt)
    return (
      opt.value.toLowerCase().includes(keyword) ||
      opt.label.toLowerCase().includes(keyword)
    );
  });
}

export function validator(value) {
  return !!value;
}