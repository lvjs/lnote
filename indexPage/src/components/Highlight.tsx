type HightlightProps = {
  text: string;
  keyword: string;
  style?: string;
};
export default function (props: HightlightProps) {
  const { text, keyword, style } = props;
  const splitText = text.split(keyword);
  const res: string[] = [];
  for (let i = 0; i < splitText.length; i++) {
    if (i > 0) {
      res.push(keyword);
    }
    if (splitText[i]) res.push(splitText[i]);
  }
  return (
    <span>
      {res.map((str) => {
        if (str === keyword) {
          return (
            <span
              style={style || "font-weight: bold;color: #000000 !important;"}
            >
              {str}
            </span>
          );
        } else {
          return str;
        }
      })}
    </span>
  );
}
