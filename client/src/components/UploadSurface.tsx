import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';

const UploadSurface = ({}) => {

	return (
		<div className="h-full w-3/4 flex flex-col justify-center items-center">

			  <div className="h-32 w-1/2 border-2 border-dashed border-gray-300 rounded-lg 
                  hover:border-gray-400 hover:bg-gray-50 
                  transition-colors duration-200 ease-in-out
                  flex items-center justify-center cursor-pointer">
				<DndContext>
					<Droppable>
						<p className="text-gray-500 text-lg">Drop your netlist file here</p>
					</Droppable>
				</DndContext>
				</div>
		</div>
	)

}

export default UploadSurface;