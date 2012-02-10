module Graph where

import Control.Monad.State
import Data.Array
import Geometry
import Graphics.Gloss.Data.Picture
import Maybe ( mapMaybe )



type Index = Int
type Level = Int
data Vertex = Vertex (Maybe Level) IntPoint deriving Show

type VertexArray = Array Index Vertex
type GraphState = State (VertexArray, EdgeList)
type EdgeList = [Edge]
data Edge = Edge (Index, Index) | Visited (Index, Index) deriving Show

fI = fromIntegral

getEdges :: GraphState [Edge]
getEdges = do (_, edges) <- get
              return edges

getVertices :: GraphState VertexArray
getVertices = do (vertices, _) <- get
                 return vertices

xLocation :: Vertex -> Float
xLocation (Vertex l (a, b)) = fI a

yLocation :: Vertex -> Float
yLocation (Vertex l (a, b)) = fI b

setLevel :: Level -> Vertex -> Vertex
setLevel l' (Vertex l (a, b)) = (Vertex (Just l') (a, b))

location :: Vertex -> Point
location v = ((xLocation v), (yLocation v))

intLocation :: Vertex -> IntPoint
intLocation (Vertex _ p) = p

start :: Edge -> Int
start (Edge (s, e)) = s

end :: Edge -> Int
end (Edge (s, e)) = e

neighbors :: Index -> [Edge] -> [Index]
neighbors i edges = mapMaybe (\edge -> let isFirst = start edge == i
                                           isSecond = end edge == i
                                       in if isFirst 
                                             then Just (end edge)
                                          else if isSecond
                                                  then Just (start edge)
                                               else Nothing)
                             edges
