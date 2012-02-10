module Geometry where 

import Data.List ( partition )

type IntPoint = (Int, Int)
type ConnectingSegment = (IntPoint, IntPoint)

minus :: IntPoint -> IntPoint -> IntPoint
minus (x1, y1) (x2, y2) = (x1 - x2, y1 - y2)

crossProduct :: IntPoint -> IntPoint -> Int
crossProduct (x1, y1) (x2, y2) = x1 * y2 - x2 * y1

dirRelativeToLine :: (IntPoint, IntPoint) -> IntPoint -> Int
dirRelativeToLine (p0, p1) p2 = crossProduct (p2 `minus` p0) (p1 `minus` p0)

isCW :: Int -> Bool
isCW c = c < 0

isCCW :: Int -> Bool
isCCW c = c > 0

crosses :: ConnectingSegment -> ConnectingSegment -> Bool
crosses (a1, a2) b = let d1 = dirRelativeToLine b a1
                         d2 = dirRelativeToLine b a2
                     in (isCW d1 && isCCW d2) || (isCCW d1 && isCW d2)

segmentsIntersect :: ConnectingSegment -> ConnectingSegment -> Bool
segmentsIntersect a b = (a `crosses` b) && (b `crosses` a)

quicksort :: Ord a => [a] -> [a]
quicksort [] = []
quicksort l@(x:[]) = l
quicksort (x:xs) = let (smaller,bigger) = partition (\y -> y <= x) xs
                   in (quicksort smaller) ++ [x] ++ (quicksort bigger)
