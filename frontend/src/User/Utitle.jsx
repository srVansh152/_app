"use client"

export default function Utitle() {
  return (
    <div className=" p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Title</h2>
      <p className="text-sm text-gray-600 mb-4">
        Be specific and imagine you're asking a question to another person.
      </p>
      <input
        type="text"
        placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md">
        Next
      </button>
    </div>
  )
}