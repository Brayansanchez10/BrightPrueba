import React, { useEffect, useState, useRef, useCallback } from "react";
import { FiPlus, FiDownload, FiEdit2, FiTrash2 } from "react-icons/fi";

const CourseNotes = ({
  notes,
  editingNoteId,
  userNote,
  editedNoteContent,
  resourceNotes,
  resources,
  handleAddNote,
  handleDownloadNotes,
  handleEditNote,
  handleDeleteNote,
  handleSaveEditedNote,
  setEditingNoteId,
  setUserNote,
  setEditedNoteContent,
  handleAddResourceNote,
  handleEditResourceNote,
  handleDeleteResourceNote,
  editedResourceNoteContent,
  setEditedResourceNoteContent,
  handleSaveEditedResourceNote,
  formatDate,
  resource,
  userResourceNote,
  setEditingResourceNoteId,
  setUserResourceNote,
  editingResourceNoteId,
  t,
}) => {
  return (
    <div className="bg-[#200E3E] p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 font-bungee text-white">
        {t("resource_view.courseNotes")}
      </h3>
      {notes.length === 0 && (
        <div className="mb-4">
          <div className="relative">
            <input
              value={userNote}
              onChange={(e) => {
                const newValue = e.target.value.slice(0, 50);
                setUserNote(newValue);
              }}
              placeholder={t("resource_view.addNotePlaceholder1")}
              className="w-full bg-[#321A5A] text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#9869E3]"
              maxLength={50}
            />
            <span className="absolute right-2 bottom-[-20px] text-white text-sm">
              {`${userNote.length}/50`}
            </span>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-[#4B2F7A] font-bungee text-white rounded-md hover:bg-[#6e46b4] transition-colors flex items-center text-xs"
            >
              <FiPlus className="mr-2" /> {t("resource_view.addNote")}
            </button>
          </div>
        </div>
      )}
      <div className="space-y-4 max-h-[30rem] custom-scrollbar-y">
        {notes.map((note, index) => (
          <div
            key={note.id || index}
            className="bg-[#321A5A] p-3 rounded-lg shadow-md"
          >
            {editingNoteId === note.id ? (
              <div>
                <input
                  value={editedNoteContent}
                  onChange={(e) => setEditedNoteContent(e.target.value)}
                  className="w-full bg-[#4B2F7A] text-white rounded p-2 mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSaveEditedNote(note.id)}
                    className="px-3 py-1 bg-[#9869E3] text-white font-bungee rounded-md hover:bg-[#8A5CD6] transition-colors text-xs"
                  >
                    {t("resource_view.save")}
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-3 py-1 bg-gray-500 text-white font-bungee rounded-md hover:bg-gray-600 transition-colors text-xs"
                  >
                    {t("resource_view.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between mx-2 mb-3">
                  <p className="text-white text-lg font-semibold">
                    {note.content}
                  </p>
                  <div className="space-x-2 flex items-center">
                    <button
                      onClick={handleDownloadNotes}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={() => handleEditNote(note.id, note.content)}
                      className="text-[#9869E3] hover:text-[#8A5CD6]"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                {resourceNotes &&
                resourceNotes.some(
                  (note) => note.resourceId === resource.id
                ) ? (
                  <div className="text-white text-sm italic mb-2 mx-1">
                    {t("resource_view.resourceNoteExists")}
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <textarea
                      value={userResourceNote}
                      onChange={(e) => {
                        const newValue = e.target.value.slice(0, 1000);
                        setUserResourceNote(newValue);
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                      placeholder={t("resource_view.addNotePlaceholder2")}
                      className="w-full bg-[#4B2F7A] text-white rounded-md p-2 mb-2 overflow-hidden resize-none"
                      style={{ minHeight: "100px" }}
                      maxLength={1000}
                    />
                    <div className="flex justify-between w-full mb-2">
                      <span className="text-white text-sm">{`${userResourceNote.length}/1000`}</span>
                      <button
                        onClick={handleAddResourceNote}
                        className="flex items-center justify-center w-24 py-1 bg-[#9869E3] text-white font-bungee rounded-md hover:bg-[#8A5CD6] transition-colors text-xs"
                      >
                        {t("resource_view.addNote")}
                      </button>
                    </div>
                  </div>
                )}
                {resourceNotes && resourceNotes.length > 0 ? (
                  resourceNotes
                    .sort((a, b) => {
                      const indexA = resources.findIndex(r => r.id === a.resourceId);
                      const indexB = resources.findIndex(r => r.id === b.resourceId);
                      return indexA - indexB;
                    })
                    .map((resourceNote, index) => {
                      const correspondingResource = resources.find(
                        (resource) => resource.id === resourceNote.resourceId
                      );

                      return (
                        <div
                          key={resourceNote.id || index}
                          className="bg-gray-200 p-3 rounded-lg shadow-md mb-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold">
                              {correspondingResource
                                ? correspondingResource.title
                                : `Recurso ${resourceNote.resourceId}`}
                            </p>
                            <div className="space-x-2">
                              <button
                                onClick={() =>
                                  handleEditResourceNote(
                                    resourceNote.id,
                                    resourceNote.content
                                  )
                                }
                                className="text-[#6d4aa5] hover:text-[#a473f3]"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteResourceNote(resourceNote.id)
                                }
                                className="text-red-600 hover:text-red-400"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                          {editingResourceNoteId === resourceNote.id ? (
                            <div>
                              <textarea
                                value={editedResourceNoteContent}
                                onChange={(e) =>
                                  setEditedResourceNoteContent(e.target.value)
                                }
                                className="w-full bg-white text-gray-800 rounded p-2 mb-2"
                                rows="3"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() =>
                                    handleSaveEditedResourceNote(
                                      resourceNote.id
                                    )
                                  }
                                  className="px-3 py-1 bg-[#4B2F7A] text-white font-bungee rounded-md hover:bg-[#6e46b4] transition-colors text-xs"
                                >
                                  {t("resource_view.save")}
                                </button>
                                <button
                                  onClick={() => setEditingResourceNoteId(null)}
                                  className="px-3 py-1 bg-gray-500 text-white font-bungee rounded-md hover:bg-gray-600 transition-colors text-xs"
                                >
                                  {t("resource_view.cancel")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <pre className="whitespace-pre-wrap mb-1 font-sans text-sm">
                              {resourceNote.content}
                            </pre>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <p className="text-white italic mb-2">
                    {t("resource_view.noResourceNotes")}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-white italic">{t("resource_view.noNotes")}</p>
        )}
      </div>
    </div>
  );
};

export default CourseNotes;
