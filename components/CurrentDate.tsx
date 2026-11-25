
import { connection } from "next/server";

export default async function CurrentDate() {
  await connection();

  return (
    <span>
      {new Date().toLocaleDateString("en-US", {
        dateStyle: "long",
        timeZone: "America/La_Paz",
      })}
    </span>
  );
}
