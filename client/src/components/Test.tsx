export default function Test() {
  const getScrap = async (keyword: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_SCRAP_API}/api/scrap?keyword=${keyword}`,
    ).then((response) => response.json());

    console.log(response);
    // return await response.json();
  };

  getScrap("반팔");

  return <></>;
}
