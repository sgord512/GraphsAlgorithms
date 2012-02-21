module Main where

import Control.Monad.State
import Data.Array
import Data.List ( find, partition )
import Data.Set ( Set, member, fromList )
import Debug.Trace
import Geometry
import Graph
import Graphics.Gloss 
import Graphics.Gloss.Data.Picture 
import Maybe ( isNothing, mapMaybe )
import Monad ( liftM )
-- import NumericPrelude
-- import Prelude ( Float )
import System.Random

gridSize = 20
gridSpacing = 10
circleRadius = 4
numVertices = 20
numEdges = 20

rows = 4
columns = 5


screen = InWindow "Graph display by Spencer Gordon"  (2 * fst graphDimensions, snd graphDimensions) (100, 100) 

-- screen = FullScreen (2 * fst graphDimensions, snd graphDimensions)

graphDimensions = (2 * (gridSize + 1) * gridSpacing, 2 * (gridSize + 1) * gridSpacing)

halfGraphDimensions :: (Float, Float)
halfGraphDimensions = ((fI $ fst graphDimensions) / 2, (fI $ snd graphDimensions) / 2)




getRandomVertex :: IO Vertex
getRandomVertex = do x <- getStdRandom (randomR (0 - gridSize, gridSize))
                     y <- getStdRandom (randomR (0 - gridSize, gridSize))
                     return $ Vertex Nothing (gridSpacing * x, gridSpacing * y)

generateVertices r c = [Vertex Nothing (gridSpacing * x - (fI ((columns * gridSpacing) / 2)), gridSpacing * y - (fI ((rows * gridSpacing) / 2))) | x <- [1..columns], y <- [1..rows] ]


getRandomEdge :: IO Edge
getRandomEdge = do a <- getStdRandom (randomR (1, numVertices - 1))
                   b <- getStdRandom (randomR (1, numVertices - 1))
                   return $ Edge (a, b)

getRandomVertexForEdge :: Int -> IO Int
getRandomVertexForEdge i = do getStdRandom (randomR (1, numVertices - 1))
                              
vertexColor :: Index -> Set Index -> Index -> Picture -> Picture
vertexColor startVertex neighbors i = if startVertex == i 
                                         then color green
                                      else if member i neighbors
                                              then color red
                                           else color white

removeFirstIntersection :: Edge -> GraphState ()
removeFirstIntersection edge = do edges <- getEdges
                                  (a1, b1) <- endpoints edge
                                  intersectingEdge <- findM (\e -> liftM (segmentsIntersect (a1,b1)) (endpoints e)) edges
                                  case intersectingEdge of
                                       Nothing -> return ()
                                       Just intersectEdge -> do vertices <- getVertices
                                                                (a2, b2) <- endpoints intersectEdge
                                                                put (vertices // [(start edge, Vertex Nothing a2), (start intersectEdge, Vertex Nothing a1)], edges) 
                                                                removeFirstIntersection edge
                                                                return ()


findM :: Monad m => (a -> m Bool) -> [a] -> m (Maybe a)
findM f [] = return Nothing
findM f (x:xs) = do result <- f x
                    answer <- if result
                                 then return $ Just x
                                 else findM f xs
                    return answer

endpoints :: Edge -> GraphState ConnectingSegment
endpoints e = do vArr <- getVertices
                 return (intLocation $ vArr ! (start e), intLocation $ vArr ! (end e))

drawVertices :: Index -> GraphState Picture
drawVertices startVertex = do vArr <- getVertices
                              edges <- getEdges
                              let vColor = vertexColor startVertex (fromList $ neighbors startVertex edges)
                              return $ (Pictures $ map (\(i, v) -> (vColor i) $ translate (xLocation v) (yLocation v) $ circleSolid circleRadius) (assocs vArr))

drawEdges :: GraphState Picture
drawEdges = do vArr <- getVertices
               edges <- getEdges
               return (Pictures $ map (\e -> color white $ Line [location $ vArr ! (start e), location $ vArr ! (end e)]) edges)

main = do vertices_original <- sequence $ replicate numVertices getRandomVertex
          edgeList <- sequence $ replicate numEdges getRandomEdge
          startVertex <- getStdRandom (randomR (0, numVertices))
          -- putStr "Vertices: " >> print vertices_original
          -- putStr "Num of vertices: " >> (print $ length vertices_original)
          -- putStr "List of edges: " >> print edgeList
          let vertexArray = array (1, length vertices_original) (zip [1,2..] vertices_original)
          let fixedEdges = zipWith (\a b -> Edge (a,b)) [1,2..] (map (\(Edge (a,b)) -> b) edgeList)
          let startingGraph = (vertexArray, fixedEdges)
              (vertices, edges) = foldr (\edge graph -> execState (removeFirstIntersection edge) graph) startingGraph fixedEdges
              cleanedUpGraph = (vertices, edges)
              pointsImage = evalState (drawVertices startVertex) cleanedUpGraph
              edgesImage = evalState drawEdges cleanedUpGraph
              cleanPicture = Pictures [pointsImage, edgesImage]
              originalPointsImage = evalState (drawVertices startVertex) startingGraph
              originalEdgesImage = evalState  drawEdges startingGraph
              originalPicture = Pictures [originalPointsImage, originalEdgesImage]
          display screen black $ Pictures [translate (0 - (fst halfGraphDimensions)) (fI 0) originalPicture, translate (fst halfGraphDimensions) (fI 0) cleanPicture, color orange $ circleSolid 2]
