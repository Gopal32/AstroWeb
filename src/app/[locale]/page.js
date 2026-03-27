import Body from "../components/body";
import  FCMProvider from "../components/FCMProvider";

export default function HomePage() {
  return (
    <div>
      <Body />
      <FCMProvider />
    </div>
  );
}
