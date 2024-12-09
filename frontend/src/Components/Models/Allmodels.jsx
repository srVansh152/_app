import React from "react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

import "./style.css";

export const MyPlugin = () => {
  return (
    <div id="webcrumbs"> 
                	<div className="w-[400px] bg-white rounded-lg shadow-lg p-6">
    	  <h1 className="font-title text-lg font-semibold text-neutral-900 mb-4">Add Important Number</h1>
    	  <form className="space-y-4">
    	    <div>
    	      <label className="block text-neutral-700 text-sm font-medium">
    	        Full Name<span className="text-red-500">*</span>
    	      </label>
    	      <input
    	        type="text"
    	        placeholder="Enter Full Name"
    	        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
    	      />
    	    </div>
    	
    	    <div>
    	      <label className="block text-neutral-700 text-sm font-medium">
    	        Phone Number<span className="text-red-500">*</span>
    	      </label>
    	      <input
    	        type="text"
    	        placeholder="+91"
    	        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
    	      />
    	    </div>
    	
    	    <div>
    	      <label className="block text-neutral-700 text-sm font-medium">
    	        Work<span className="text-red-500">*</span>
    	      </label>
    	      <input
    	        type="text"
    	        placeholder="Enter Work"
    	        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
    	      />
    	    </div>
    	    
    	    <div className="flex justify-between mt-6">
    	      <button
    	        type="button"
    	        className="px-6 py-2 border border-neutral-300 rounded-full text-neutral-500 hover:bg-neutral-100"
    	      >
    	        Cancel
    	      </button>
    	      <button
    	        type="submit"
    	        className="px-6 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600"
    	      >
    	        Save
    	      </button>
    	    </div>
    	  </form>
    	</div> 
                </div>
  )
}

