['style', 'link'].forEach((t) =>
  Array.from(document.getElementsByTagName(t)).forEach((i) =>
    i.parentElement.removeChild(i),
  ),
)
