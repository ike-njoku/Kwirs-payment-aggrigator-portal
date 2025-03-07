// "use client";

// import React, { useState, useEffect } from "react";
// import { AxiosGet, AxiosPost } from "../../../services/http-service";
// import { toast } from "react-toastify";
// import ModalLayout from "./ModalLayout";
// import AuthButtons from "../buttons/AuthButtons";

// const EditRoleResourceModal = ({
//   isOpen,
//   onClose,
//   roleResourceId,
//   selectedRoleResource,
//   selectedRole,
// }) => {
//   const [roleDetails, setRoleDetails] = useState("");
//   const [ResourcesId, setResourcesId] = useState("");
//   const [RoleId, setRoleId] = useState("");
//   const [RoleResourceId, setRoleResourceId] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
//   const fetchRoleResourceDetails = async () => {
//     if (!roleResourceId) return;

//     try {
//       const response = await AxiosGet(
//         `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${roleResourceId}`
//       );

//       if (response?.data?.StatusCode === 200 && response.data.Data) {
//         const roleResource = response.data.Data.find(
//           (item) => item.RoleResourceId === roleResourceId
//         );

//         if (roleResource) {
//           setRoleDetails(roleResource.RoleName || "");
//           setResourcesId(roleResource.ResourceName || "");
//           setRoleId(roleResource.RoleId || "");
//           setRoleResourceId(roleResource.RoleResourceId || "");
//         } else {
//           toast.error("Role-Resource not found.");
//         }
//       } else {
//         toast.error("Could not fetch role resource.");
//       }
//     } catch (error) {
//       console.error("Error fetching role resource:", error);
//       toast.error("Error fetching role resource.");
//     }
//   };

//   const handleUpdateRoleResource = async () => {
//     if (!API_BASE_URL) {
//       toast.error("API base URL is missing.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         UserName: userEmail,
//         RoleId: RoleId,
//         ResourcesId: ResourcesId,
//         RoleResourceId: RoleResourceId,
//       };

//       const response = await AxiosPost(
//         `${API_BASE_URL}/api/RoleResources/Update`,
//         payload
//       );

//       if (response?.StatusCode !== 200) {
//         toast.error("Could not update role-resource at this time.");
//         return;
//       }

//       toast.success("Role resource updated successfully!");

//       setTimeout(() => {
//         onClose();
//       }, 2000);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.StatusMessage || "Error updating role-resource."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && roleResourceId) {
//       fetchRoleResourceDetails();
//     }
//   }, [isOpen, roleResourceId]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const storedUser = localStorage.getItem("authDetails");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           setUserEmail(parsedUser?.email || "");
//         } else {
//           toast.error("User data not found. Please log in again.");
//         }
//       } catch (error) {
//         toast.error("Invalid user data. Please log in again.");
//       }
//     }
//   }, []);

//   return (
//     <ModalLayout handleCloseModal={onClose}>
//       <div className="w-full p-5">
//         <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
//           Role Resource
//         </h3>

//         <form
//           className="w-full mt-4"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdateRoleResource();
//           }}
//         >
//           <input type="text" value={userEmail} />

//           <div className="w-full mb-4">
//             <label className="text-base font-medium text-gray-700">Role</label>
//             <input
//               type="text"
//               className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
//               value={selectedRole.Name}
//               onChange={(e) => setRoleDetails(e.target.value)}
//             />
//           </div>

//           <div className="w-full mb-4">
//             <label className="text-base font-medium text-gray-700">
//               Resource
//             </label>
//             <input
//               type="text"
//               className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
//               value={selectedRoleResource.Name}
//               onChange={(e) => setResourcesId(e.target.value)}
//             />
//           </div>

//           <input type="text" value={RoleResourceId} />

//           <AuthButtons
//             label={loading ? "Updating..." : "Update Role Resource"}
//             textColor="text-white"
//             isLoading={loading}
//             onClick={handleUpdateRoleResource}
//           />
//         </form>
//       </div>
//     </ModalLayout>
//   );
// };

// export default EditRoleResourceModal;






// "use client";

// import React, { useState, useEffect } from "react";
// import { AxiosGet, AxiosPost } from "../../../services/http-service";
// import { toast } from "react-toastify";
// import ModalLayout from "./ModalLayout";
// import AuthButtons from "../buttons/AuthButtons";

// const EditRoleResourceModal = ({
//   isOpen,
//   onClose,
//   roleResourceId,
//   selectedRoleResource,
//   selectedRole,
// }) => {
//   const [roleDetails, setRoleDetails] = useState("");
//   const [ResourcesId, setResourcesId] = useState("");
//   const [RoleId, setRoleId] = useState("");
// //   const [RoleResourceId, setRoleResourceId] = useState("");
//   const [userEmail, setUserEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [RoleResourceId, setRoleResourceId] = useState(roleResourceId ?? "");


//   const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


//   useEffect(() => {
//     if (isOpen && roleResourceId) {
//       console.log("Fetching Role Resource with ID:", roleResourceId); // Debugging log
//       fetchRoleResourceDetails();
//     }
//   }, [isOpen, roleResourceId]);

// //   const fetchRoleResourceDetails = async () => {
// //     if (!roleResourceId) return;
  
// //     try {
// //       const response = await AxiosGet(
// //         `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${roleResourceId}`
// //       );
  
// //       console.log("API Response:", response?.data); // Debugging
  
// //       if (response?.data?.StatusCode === 200 && response.data.Data) {
// //         const roleResource = response.data.Data.find(
// //           (item) => item.RoleResourceId === roleResourceId
// //         );
  
// //         if (roleResource) {
// //           setRoleDetails(roleResource.RoleName || "");
// //           setResourcesId(roleResource.ResourceName || "");
// //           setRoleId(roleResource.RoleId || "");
// //           setRoleResourceId(roleResource.RoleResourceId || ""); // Ensure it's set
// //           console.log("Fetched RoleResourceId:", roleResource.RoleResourceId); // Debugging
// //         } else {
// //           toast.error("Role-Resource not found.");
// //         }
// //       } else {
// //         toast.error("Could not fetch role resource.");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching role resource:", error);
// //       toast.error("Error fetching role resource.");
// //     }
// //   };
  
//   const fetchRoleResourceDetails = async () => {
//     if (!selectedRole || !selectedRole.RoleId) {
//       console.error("No RoleId provided for fetching resources.");
//       return;
//     }
  
//     console.log("Fetching Role Resources with RoleId:", selectedRole.RoleId);
  
//     try {
//       const response = await AxiosGet(
//         `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRole.RoleId}`
//       );
  
//       console.log("API Response:", response);
  
//       if (response?.StatusCode === 200) {
//         setRoleResources(response.data);
//       } else {
//         console.warn("No role resources found:", response.StatusMessage);
//       }
//     } catch (error) {
//       console.error("Error fetching role resources:", error.response?.data || error);
//     }
//   };
    


//   const handleUpdateRoleResource = async () => {
//     if (!selectedRoleResource || !selectedRoleResource.RoleResourceId) {
//       console.error("No RoleResourceId provided for updating.");
//       toast.error("Invalid role resource data.");
//       return;
//     }
  
//     const payload = {
//       UserName: userEmail,
//       RoleId: selectedRoleResource.RoleId,
//       ResourcesId: selectedRoleResource.ResourcesId,
//       RoleResourceId: selectedRoleResource.RoleResourceId, // Make sure this is valid
//     };
  
//     console.log("Updating Role Resource with Payload:", payload);
  
//     try {
//       const response = await AxiosPost(
//         `${API_BASE_URL}/api/RoleResources/Update`,
//         payload
//       );
  
//       console.log("Update API Response:", response);
  
//       if (response?.StatusCode === 200) {
//         toast.success("Role resource updated successfully!");
//         onClose();
//       } else {
//         toast.error(response.StatusMessage || "Update failed.");
//       }
//     } catch (error) {
//       console.error("Error updating role resource:", error.response?.data || error);
//       toast.error(error.response?.data?.StatusMessage || "Error updating role resource.");
//     }
//   };
  
  

//   useEffect(() => {
//     if (isOpen && roleResourceId) {
//       fetchRoleResourceDetails();
//     }
//   }, [isOpen, roleResourceId ?? ""]); // ✅ Avoids undefined values
  
  

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const storedUser = localStorage.getItem("authDetails");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           setUserEmail(parsedUser?.email || "");
//         } else {
//           toast.error("User data not found. Please log in again.");
//         }
//       } catch (error) {
//         toast.error("Invalid user data. Please log in again.");
//       }
//     }
//   }, []);

//   return (
//     <ModalLayout handleCloseModal={onClose}>
//       <div className="w-full p-5">
//         <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
//           Role Resource
//         </h3>

//         <form
//           className="w-full mt-4"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdateRoleResource();
//           }}
//         >
//           <input type="text" value={userEmail} />

//           <div className="w-full mb-4">
//             <label className="text-base font-medium text-gray-700">Role</label>
//             <input
//               type="text"
//               className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
//               value={selectedRole.Name}
//               onChange={(e) => setRoleDetails(e.target.value)}
//             />
//           </div>

//           <div className="w-full mb-4">
//             <label className="text-base font-medium text-gray-700">
//               Resource
//             </label>
//             <input
//               type="text"
//               className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
//               value={selectedRoleResource.Name}
//               onChange={(e) => setResourcesId(e.target.value)}
//             />
//           </div>

//           <input
//   type="text"
//   className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
//   value={RoleResourceId || ""}
//   readOnly
// />


//           <AuthButtons
//             label={loading ? "Updating..." : "Update Role Resource"}
//             textColor="text-white"
//             isLoading={loading}
//             onClick={handleUpdateRoleResource}
//           />
//         </form>
//       </div>
//     </ModalLayout>
//   );
// };

// export default EditRoleResourceModal;





"use client";

import React, { useState, useEffect } from "react";
import { AxiosGet, AxiosPost } from "../../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "./ModalLayout";
import AuthButtons from "../buttons/AuthButtons";

const EditRoleResourceModal = ({ isOpen, onClose, roleResourceId, selectedRoleResource, selectedRole }) => {
  const [roleDetails, setRoleDetails] = useState("");
  const [resourcesId, setResourcesId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roleResourceIdState, setRoleResourceId] = useState(roleResourceId ?? "");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [resources, setResources] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      fetchResources();
      if (roleResourceId) {
        fetchRoleResourceDetails();
      }
    }
  }, [isOpen, roleResourceId]);

  const fetchRoleResourceDetails = async () => {
    if (!selectedRole || !selectedRole.RoleId) {
      
      return;
    }

    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRole.RoleId}`);
      
      if (response?.data?.StatusCode === 200) {
        const roleData = response.data.Data;
        setRoleDetails(roleData.RoleName || "");
        setResourcesId(roleData.ResourceId || "");
        setRoleId(roleData.RoleId || "");
        setRoleResourceId(roleData.RoleResourceId || "");
      } else {
        console.warn("No role resources found:", response.data.StatusMessage);
      }
    } catch (error) {
      console.error("Error fetching role resources:", error.response?.data || error);
    }
  };

  const handleUpdateRoleResource = async () => {
    if (!roleId || !resourcesId || !roleResourceIdState) {
      toast.error("Please select both role and resource before updating.");
      return;
    }

    const payload = {
      UserName: userEmail,
      RoleId: roleId,
      ResourcesId: resourcesId,
      RoleResourceId: roleResourceIdState,
    };

    try {
      setLoading(true);
      const response = await AxiosPost(`${API_BASE_URL}/api/RoleResources/Update`, payload);

      if (response?.data?.StatusCode === 200) {
        toast.success("Role resource updated successfully!");
        onClose();
      } else {
        toast.error(response.data.StatusMessage || "Update failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.StatusMessage || "Error updating role resource.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      if (response?.data?.StatusCode === 200) {
        setRoles(response.data.Data || []);
      } else {
        toast.error("Could not fetch roles");
      }
    } catch (error) {
      toast.error("Error fetching roles");
    }
  };

  const fetchResources = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Resources/GetAllResource`);
      
      console.log("🔍 Resources API Response:", response); // ✅ Full API response
  
      if (response?.data?.StatusCode === 200 && Array.isArray(response.data.Data)) {
        console.log("✅ Setting Resources State:", response.data.Data); // ✅ Confirm data structure
        setResources(response.data.Data);
      } else {
        console.error("⚠️ Unexpected API Response Structure:", response.data);
        toast.error("Could not fetch resources");
      }
    } catch (error) {
      console.error("❌ Error fetching resources:", error.response?.data || error);
      toast.error("Error fetching resources");
    }
  };
  
  // Log state update
  useEffect(() => {
    console.log("📌 Resources State Updated:", resources);
  }, [resources]);
  

  useEffect(() => {
    console.log("Resources State Updated:", resources); // ✅ Logs when state updates
  }, [resources]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserEmail(parsedUser?.email || "");
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);

  return (
    <ModalLayout handleCloseModal={onClose}>
      <div className="w-full p-5">
        <h3 className="text-lg font-semibold pb-4 border-b border-gray-300 text-gray-700">
          Role Resource
        </h3>

        <form className="w-full mt-4" onSubmit={(e) => { e.preventDefault(); handleUpdateRoleResource(); }}>
          {/* User Email */}
          <input type="text" value={userEmail} readOnly className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700" />

          {/* Role Dropdown */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Role</label>
            <select
              className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.Id} value={role.Id}>{role.Name}</option>
              ))}
            </select>
          </div>

          {/* Resource Dropdown */}
          <div className="w-full mb-4">
            <label className="text-base font-medium text-gray-700">Resource</label>
            {resources.length > 0 ? (
              <select
                className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
                value={resourcesId}
                onChange={(e) => setResourcesId(e.target.value)}
              >
                <option value="">Select a Resource</option>
                {resources.map((res) => (
                  <option key={res.Id} value={res.Id}>
                    {res.Name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-500">Loading resources...</p>
            )}
          </div>

          {/* Role Resource ID */}
          <input
            type="text"
            className="w-full border-b-2 border-gray-300 h-[45px] rounded-md my-2 bg-gray-100 px-3 text-gray-700"
            value={roleResourceIdState || ""}
            readOnly
          />

          {/* Submit Button */}
          <AuthButtons
            label={loading ? "Updating..." : "Update Role Resource"}
            textColor="text-white"
            isLoading={loading}
            onClick={handleUpdateRoleResource}
          />
        </form>
      </div>
    </ModalLayout>
  );
};

export default EditRoleResourceModal;
