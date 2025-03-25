import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router";
import { useWeatherStore } from "@/stores/weatherStore.ts";

export default function RecommendWear() {
  const { weather } = useWeatherStore();

  return (
    <div className={"rounded-lg border p-5"}>
      <p className={"pb-5 text-2xl font-bold"}>SUB</p>

      <div className={"grid grid-cols-5 gap-5"}>
        {weather ? (
          // 이미지
          <>
            <Link
              to={`https://www.musinsa.com/search/goods?keyword=반팔`}
              target={"_blank"}
            >
              <img
                src="https://image.msscdn.net/thumbnails/images/goods_img/20230623/3380690/3380690_17151291625741_big.jpg?w=780"
                className={"aspect-5/6 rounded object-cover object-center"}
              />
            </Link>
            <Link
              to={`https://www.musinsa.com/search/goods?keyword=가디건`}
              target={"_blank"}
            >
              <img
                src="https://image.msscdn.net/thumbnails/images/goods_img/20230116/3025211/3025211_17170562565228_big.jpg?w=780"
                className={"aspect-5/6 rounded object-cover object-center"}
              />
            </Link>
            <Link
              to={`https://www.musinsa.com/search/goods?keyword=맨투맨`}
              target={"_blank"}
            >
              <img
                src="https://image.msscdn.net/thumbnails/images/goods_img/20200305/1336836/1336836_17297329205750_big.jpg?w=780"
                className={"aspect-5/6 rounded object-cover object-center"}
              />
            </Link>
            <Link
              to={`https://www.musinsa.com/search/goods?keyword=긴바지`}
              target={"_blank"}
            >
              <img
                src="https://image.msscdn.net/thumbnails/images/goods_img/20210315/1844582/1844582_17276694137830_big.jpg?w=780"
                className={"aspect-5/6 rounded object-cover object-center"}
              />
            </Link>
            <Link
              to={`https://www.musinsa.com/search/goods?keyword=후드`}
              target={"_blank"}
            >
              <img
                src="https://image.msscdn.net/thumbnails/images/goods_img/20240819/4342727/4342727_17289532339728_big.jpg?w=780"
                className={"aspect-5/6 rounded object-cover object-center"}
              />
            </Link>
          </>
        ) : (
          // 스켈레톤
          <>
            <Skeleton className="aspect-5/6 rounded" />
            <Skeleton className="aspect-5/6 rounded" />
            <Skeleton className="aspect-5/6 rounded" />
            <Skeleton className="aspect-5/6 rounded" />
            <Skeleton className="aspect-5/6 rounded" />
          </>
        )}
      </div>
    </div>
  );
}
