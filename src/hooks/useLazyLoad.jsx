import { useEffect, useRef, useState } from "react";

export default function useLazyLoad(data = [], batchSize = 20) {
  const [visible, setVisible] = useState([]);
  const indexRef = useRef(0);

  useEffect(() => {
    setVisible(data.slice(0, batchSize));
    indexRef.current = batchSize;
  }, [data, batchSize]);

  const loadMore = () => {
    const next = data.slice(
      indexRef.current,
      indexRef.current + batchSize
    );
    setVisible(prev => [...prev, ...next]);
    indexRef.current += batchSize;
  };

  return { visible, loadMore };
}