SELECT s.id, s.symbol,sum(CASE type
        WHEN 'BUY' THEN
          quantity
        WHEN 'SELL' THEN
          -quantity
        ELSE
          0
      END)
  , SUM(price * quantity * (
  CASE
          WHEN type = 'BUY' THEN 1
    ELSE 0
   END
  )) / SUM(
     CASE
          WHEN type = 'BUY' THEN quantity
    ELSE 0
   END
  ) AS avgBuyingPrice
  FROM "trades" t join stocks s on t."stockId" = s.id
  GROUP BY s.symbol ,s.id ;
