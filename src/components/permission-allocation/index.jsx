// "use client";
// import React, { useEffect, useState } from "react";
// import CustomTable from "../shared-components/table/RoleResources";
// import DashboardLayout from "../shared-components/layouts/DashboardLayout";
// import { AxiosGet } from "../../services/http-service";
// import { toast } from "react-toastify";
// import RolePermissionTable from "../shared-components/table/RolePermissions";
// import PermissionAllocationModal from "../shared-components/modals/PermissionAllocationModal";
// import EditRoleResourceModal from "../shared-components/modals/EditRoleResourceModal";
// import { FaPlus, FaFilter } from "react-icons/fa";
// import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

// const PermissionAllocationPage = () => {
//   const tableHeadings = ["Created By", "Role Name", "Permission Name", "Actions"];
//   const [roleResources, setRoleResources] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [permissions, setPermissions] = useState([]);
//   // const [selectedRoleId, setSelectedRoleId] = useState(null);
//   const [openRoleResourceModal, setOpenRoleResourceModal] = useState(false);
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedRoleResource, setSelectedRoleResource] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [tableData, setTableData] = useState([]);
//   const [selectedRole, setSelectedRole] = useState({});
//   const [allRolePermissions, setAllRolePermissions] = useState([]);
// const [filteredData, setFilteredData] = useState([]);
// const [selectedRoleId, setSelectedRoleId] = useState(null); // Role selection

// useEffect(() => {
//   const fetchAllRolePermissions = async () => {
//     setLoading(true);
//     try {
//       // Fetch all role permissions
//       const response = await AxiosGet(`${API_BASE_URL}/api/RolePermission/GetAll`);

//       console.log("API Response:", response.data);

//       const rolePermissions = Array.isArray(response.data.Data) ? response.data.Data : [];

//       // Format data
//       const formattedData = await Promise.all(
//         rolePermissions.map(async (item) => ({
//           createdBy: await fetchUserName(item.CreatedBy),
//           roleName: await fetchRoleName(item.RoleId),
//           permissionName: await fetchPermissionName(item.permissionId),
//           roleId: item.RoleId, // Store RoleId for filtering
//           permissionId: item.permissionId,
//         }))
//       );

//       setAllRolePermissions(formattedData); // Save all data
//       setFilteredData(formattedData); // Initially, show all
//     } catch (error) {
//       console.error("Error fetching role permissions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAllRolePermissions();
// }, []); // Runs once on mount

// // 🔹 Filter data when selectedRoleId changes
// useEffect(() => {
//   if (selectedRoleId) {
//     const filtered = allRolePermissions.filter(
//       (item) => item.roleId === selectedRoleId
//     );
//     setFilteredData(filtered);
//   } else {
//     setFilteredData(allRolePermissions); // Show all if no role selected
//   }
// }, [selectedRoleId, allRolePermissions]);


//   const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//   const fetchRoles = async () => {
//     try {
//       const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
//       if (response?.data?.StatusCode === 200) {
//         setRoles(response.data.Data || []);
//       } else {
//         setError("Could not fetch roles.");
//       }
//     } catch (error) {
//       setError("Error fetching roles.");
//     }
//   };

//   const fetchRoleResources = async () => {
//     try {
//       setLoading(true);

//       if (!selectedRoleId) {
//         setError("Please select a role.");
//         setRoleResources([]);
//         return;
//       }

//       const response = await AxiosGet(
//         `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRoleId}`
//       );

//       if (response?.data?.StatusCode === 200) {
//         setRoleResources(response.data.Data || []);
//       } else {
//         setError("Could not fetch role resources.");
//       }
//     } catch (error) {
//       setError("Error fetching role resources.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllResources = async () => {
//     const apiResponse = await AxiosGet(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/GetAllResource`
//     );

//     if (!apiResponse) {
//       toast.error("Could not fetch resources");
//       return;
//     }

//     const { data } = apiResponse;
//     const tableData = data.Data || data.resources || [];

//     if (!tableData.length) {
//       toast.warn("No resources found");
//       setTableData([]);
//       return;
//     }

//     tableData.map((item) => (item.name = item.ResourceName));
//     tableData.map((item) => (item.id = item.ResourceId));

//     tableData.map((item) => (item.resourceType = item.ResourceTypeId));
//     tableData.map(
//       (item) =>
//         (item.resourceType = item.ResourceTypeId == 1 ? MAIN_MENU : SUB_MENU)
//     );

//     tableData.map((item) => (item.resourceURL = item.URL));

//     tableData.map(
//       (item) =>
//         (item.dateCreated = new Date(item.CreateDate)
//           .toISOString()
//           .split("T")[0])
//     );

//     setTableData(tableData);
//   };


//   const fetchUserName = async (userId) => {
//     try {
//       const response = await AxiosGet(`${API_BASE_URL}/api/User/GetUser/${userId}`);
//       return response.data?.Data?.FirstName || "Unknown";
//     } catch (error) {
//       console.error(`Error fetching user (${userId}):`, error);
//       return "Unknown";
//     }
//   };
  
//   const fetchRoleName = async (roleId) => {
//     try {
//       const response = await AxiosGet(`${API_BASE_URL}/api/Role/GetRole/${roleId}`);
//       return response.data?.Data?.Name || "Unknown";
//     } catch (error) {
//       console.error(`Error fetching role (${roleId}):`, error);
//       return "Unknown";
//     }
//   };
  
//   const fetchPermissionName = async (permissionId) => {
//     try {
//       const response = await AxiosGet(`${API_BASE_URL}/api/Permission/GetPermission/${permissionId}`);
//       return response.data?.Data?.description || "Unknown";
//     } catch (error) {
//       console.error(`Error fetching permission (${permissionId}):`, error);
//       return "Unknown";
//     }
//   };
  


//   useEffect(() => {
//     if (!selectedRoleId) return; // Ensure roleId exists before making API call
  
//     const fetchRolePermissions = async () => {
//       setLoading(true);
//       try {
//         // 1️⃣ Fetch role permissions based on selectedRoleId
//         const response = await AxiosGet(
//           `${API_BASE_URL}/api/RolePermission/GetAllRolePermission/${selectedRoleId}`
//         );
        
//         console.log("API Response:", response.data); // Debugging
  
//         const rolePermissions = Array.isArray(response.data.Data) ? response.data.Data : [];
  
//         console.log("Fetched role permissions:", rolePermissions); // Debugging
  
//         // 2️⃣ Fetch corresponding names (CreatedBy, Role, Permission)
//         const formattedData = await Promise.all(
//           rolePermissions.map(async (item) => ({
//             createdBy: await fetchUserName(item.CreatedBy),
//             roleName: await fetchRoleName(item.RoleId),
//             permissionName: await fetchPermissionName(item.permissionId),
//             permissionId: item.permissionId, // Keep permissionId for delete action
//           }))
//         );
  
//         // 3️⃣ Update table data state
//         setTableData(formattedData);
//       } catch (error) {
//         console.error("Error fetching role permissions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchRolePermissions();
//   }, [selectedRoleId]);
  

//   const handleDeleteResource = async (RoleResourceId) => {
//     try {
//       const deleteResponse = await AxiosGet(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/RoleResources/RemoveResourcesFromRole/${RoleResourceId}`
//       );

//       if (deleteResponse?.data?.StatusCode === 200) {
//         toast.success("Delete Complete");

//         setRoleResources((prevData) =>
//           prevData.filter((item) => item.RoleResourceId !== RoleResourceId)
//         );
//       } else {
//         toast.error("Failed to delete resource");
//       }
//     } catch (error) {
//       toast.error("An error occurred while deleting the resource");
//     }
//   };

//   const handleSetSelectedRole = (e) => {
//     setSelectedRoleId(e.target.value);
//     setSelectedRole(roles.filter((role) => role.Id == e.target.value)[0]);
//   };

//   // const handleUpdateRoleResource = (resource) => {
//   //   setSelectedRoleResource(resource);
//   //   console.log("SeLECTING ");
//   //   console.table(resource);
//   //   setOpenEditModal(true);
//   // };

//   const handleUpdateRoleResource = (roleResource) => {
//     console.log("Selected Role Resource:", roleResource); // Debugging log
//     setSelectedRoleResource(roleResource);
//     setOpenEditModal(true);
//   };
  

//   useEffect(() => {
//     fetchRoles();
//     fetchAllResources();

//     if (selectedRoleId) {
//       fetchRoleResources();
//     } else {
//       setRoleResources([]);
//     }
//   }, [selectedRoleId]);


  

//   return (
//     <DashboardLayout page="Permission Allocation">
//       <section className="w-full">
//         <div className="w-[90%] mx-auto py-5">
//           <div className="mt-4 flex gap-4 justify-between items-center">
//             <button
//               onClick={() => setOpenRoleResourceModal(true)}
//               className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
//               disabled={loading}
//             >
//               {loading ? "Processing..." : "Assign Permission to Role"}
//               <FaPlus />
//             </button>

//             <div className="relative">
//               <select
//                 className="text-gray focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
//                 onChange={handleSetSelectedRole}
//                 value={selectedRoleId || ""}
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role.Id} value={role.Id}>
//                     {role.Name}
//                   </option>
//                 ))}
//               </select>
//               {/* <FaFilter className="absolute right-3 top-2 text-gray-500" /> */}
//             </div>
//           </div>
//         </div>

//         <div className="w-[90%] mx-auto mt-6">
//           {loading ? (
//             <p className="text-gray-600">Loading...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : (
//             <RolePermissionTable
//          tableHeadings={tableHeadings} 
//          tableData={tableData} 
//         //  onDelete={handleDeletePermission}
//         //  onEdit={handleEditPermission}
//           />
//           )}
//         </div>

//         {openRoleResourceModal && (
//           <PermissionAllocationModal
//             isOpen={openRoleResourceModal}
//             onClose={() => setOpenRoleResourceModal(false)}
//           />
//         )}

//         {openEditModal && selectedRoleResource && (
//          <EditRoleResourceModal
//          isOpen={openEditModal}
//          onClose={() => {
//            setOpenEditModal(false);
//            fetchRoleResources();
//          }}
//          roleResourceId={selectedRoleResource?.RoleResourceId} // Ensuring it's correctly set
//          selectedRoleResource={selectedRoleResource}
//          selectedRole={selectedRole}
//        />
       
//         )}
//       </section>
//     </DashboardLayout>
//   );
// };

// export default PermissionAllocationPage;






"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/RoleResources";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import RolePermissionTable from "../shared-components/table/RolePermissions";
import PermissionAllocationModal from "../shared-components/modals/PermissionAllocationModal";
import EditRoleResourceModal from "../shared-components/modals/EditRoleResourceModal";
import { FaPlus, FaFilter } from "react-icons/fa";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

const PermissionAllocationPage = () => {
  const tableHeadings = ["Created By", "Role Name", "Permission Name", "Actions"];
  const [roleResources, setRoleResources] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  // const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [openRoleResourceModal, setOpenRoleResourceModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRoleResource, setSelectedRoleResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [allRolePermissions, setAllRolePermissions] = useState([]);
const [filteredData, setFilteredData] = useState([]);
const [selectedRoleId, setSelectedRoleId] = useState(null); 
const [userRoleId, setUserRoleId] = useState([]);


const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


useEffect(() => {
  const fetchAllRolePermissions = async () => {
    setLoading(true);
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/RolePermission/GetAll`);

      console.log("API Response:");

      const rolePermissions = Array.isArray(response.data.Data) ? response.data.Data : [];

      const formattedData = await Promise.all(
        rolePermissions.map(async (item) => ({
          createdBy: await fetchUserName(item.CreatedBy),
          roleName: await fetchRoleName(item.RoleId),
          permissionName: await fetchPermissionName(item.permissionId),
          roleId: item.RoleId,
          permissionId: item.permissionId,
        }))
      );

      setAllRolePermissions(formattedData); 
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllRolePermissions();
}, []);


useEffect(() => {
  if (selectedRoleId) {
    const filtered = allRolePermissions.filter(
      (item) => item.roleId === selectedRoleId
    );
    setFilteredData(filtered);
  } else {
    setFilteredData(allRolePermissions);
  }
}, [selectedRoleId, allRolePermissions]);

  const fetchRoles = async () => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Roles/GetAllRoles`);
      if (response?.data?.StatusCode === 200) {
        setRoles(response.data.Data || []);
      } else {
        setError("Could not fetch roles.");
      }
    } catch (error) {
      setError("Error fetching roles.");
    }
  };

  const fetchRoleResources = async () => {
    try {
      setLoading(true);

      if (!selectedRoleId) {
        setError("Please select a role.");
        setRoleResources([]);
        return;
      }

      const response = await AxiosGet(
        `${API_BASE_URL}/api/RoleResources/GetAllRoleResources/${selectedRoleId}`
      );

      if (response?.data?.StatusCode === 200) {
        setRoleResources(response.data.Data || []);
      } else {
        setError("Could not fetch role resources.");
      }
    } catch (error) {
      setError("Error fetching role resources.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResources = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/GetAllResource`
    );

    if (!apiResponse) {
      toast.error("Could not fetch resources");
      return;
    }

    const { data } = apiResponse;
    const tableData = data.Data || data.resources || [];

    if (!tableData.length) {
      toast.warn("No resources found");
      setTableData([]);
      return;
    }

    tableData.map((item) => (item.name = item.ResourceName));
    tableData.map((item) => (item.id = item.ResourceId));

    tableData.map((item) => (item.resourceType = item.ResourceTypeId));
    tableData.map(
      (item) =>
        (item.resourceType = item.ResourceTypeId == 1 ? MAIN_MENU : SUB_MENU)
    );

    tableData.map((item) => (item.resourceURL = item.URL));

    tableData.map(
      (item) =>
        (item.dateCreated = new Date(item.CreateDate)
          .toISOString()
          .split("T")[0])
    );

    setTableData(tableData);
  };


  const fetchUserName = async (userId) => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/User/GetUser/${userId}`);
      console.table(response)
      console.log("-------------->>> ", response)
      return response?.FirstName || "Unknown";
    } catch (error) {
      console.error(`Error fetching user (${userId}):`, error);
      return "Unknown";
    }
  };
  
  const fetchRoleName = async (roleId) => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Role/GetRole/${roleId}`);
      return response.data?.Name || "Unknown";
    } catch (error) {
      console.error(`Error fetching role (${roleId}):`, error);
      return "Unknown";
    }
  };
  
  const fetchPermissionName = async (permissionId) => {
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Permission/GetPermission/${permissionId}`);
      return response.data?.Data?.description || "Unknown";
    } catch (error) {
      console.error(`Error fetching permission (${permissionId}):`, error);
      return "Unknown";
    }
  };
  

  const fetchPermissions = async (roleId) => {
    if (!roleId) {
      console.error("Error: roleId is undefined!");
      return;
    }
  
    try {
      const response = await AxiosGet(
        `https://nofifications.fctirs.gov.ng/api/RolePermission/GetAllRolePermission/${roleId}`
      );
      console.log("Role Permissions:", response.data);
    } catch (error) {
      console.error("Error fetching role permissions:", error);
    }
  };
  

  useEffect(() => {
    if (userRoleId) {
      fetchPermissions(userRoleId);
    } else {
      console.error("User role ID is missing!");
    }
  }, [userRoleId]);
  


  useEffect(() => {
    if (!selectedRoleId) return; 
  
    const fetchRolePermissions = async () => {
      setLoading(true);
      try {
        const response = await AxiosGet(
          `${API_BASE_URL}/api/RolePermission/GetAllRolePermission/${selectedRoleId}`
        );
        
        // console.log("API Response:", response);
  
        const rolePermissions = Array.isArray(response.data.Data) ? response.data.Data : [];
  
        console.log("Fetched role permissions:", rolePermissions);
  
        const formattedData = await Promise.all(
          rolePermissions.map(async (item) => ({
            createdBy: await fetchUserName(item.CreatedBy),
            roleName: await fetchRoleName(item.RoleId),
            permissionName: await fetchPermissionName(item.permissionId),
            permissionId: item.permissionId,
          }))
        );
  
        setTableData(formattedData);
      } catch (error) {
        console.error("Error fetching role permissions:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRolePermissions();
  }, [selectedRoleId]);
  

  const handleDeletePermission = async (roleId) => { 
      if (!roleId) {
            toast.error("Invalid permission ID.");
            return;
          }

    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/RolePermission/RemovePermissionFromRole?roleId=${roleId}`
      ); 

        if (response.data?.StatusCode === 200) {
             toast.success("Permission deleted successfully!");
             fetchPermissions();
           } else {
             toast.error(response.data?.StatusMessage || "Failed to delete permission.");
           }
         } catch (error) {
           console.error("Delete error:", error.response || error.message);
           toast.error(error.response?.data?.StatusMessage || "Error deleting permission. Kindly contact the Admin.");
         }
       };


  const handleSetSelectedRole = (e) => {
    setSelectedRoleId(e.target.value);
    setSelectedRole(roles.filter((role) => role.Id == e.target.value)[0]);
  };

  // const handleUpdateRoleResource = (resource) => {
  //   setSelectedRoleResource(resource);
  //   console.log("SeLECTING ");
  //   console.table(resource);
  //   setOpenEditModal(true);
  // };

  const handleUpdateRoleResource = (roleResource) => {
    console.log("Selected Role Resource:", roleResource); // Debugging log
    setSelectedRoleResource(roleResource);
    setOpenEditModal(true);
  };
  

  useEffect(() => {
    fetchRoles();
    fetchAllResources();

    if (selectedRoleId) {
      fetchRoleResources();
    } else {
      setRoleResources([]);
    }
  }, [selectedRoleId]);


  

  return (
    <DashboardLayout page="Permission Allocation">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="mt-4 flex gap-4 justify-between items-center">
            <button
              onClick={() => setOpenRoleResourceModal(true)}
              className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
              disabled={loading}
            >
              {loading ? "Processing..." : "Assign Permission to Role"}
              <FaPlus />
            </button>

            <div className="relative">
              <select
                className="text-gray focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                onChange={handleSetSelectedRole}
                value={selectedRoleId || ""}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.Id} value={role.Id}>
                    {role.Name}
                  </option>
                ))}
              </select>
              {/* <FaFilter className="absolute right-3 top-2 text-gray-500" /> */}
            </div>
          </div>
        </div>

        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <RolePermissionTable
         tableHeadings={tableHeadings} 
         tableData={tableData} 
         onDelete={handleDeletePermission}
        //  onEdit={handleEditPermission}
          />
          )}
        </div>

        {openRoleResourceModal && (
          <PermissionAllocationModal
            isOpen={openRoleResourceModal}
            onClose={() => setOpenRoleResourceModal(false)}
          />
        )}

        {openEditModal && selectedRoleResource && (
         <EditRoleResourceModal
         isOpen={openEditModal}
         onClose={() => {
           setOpenEditModal(false);
           fetchRoleResources();
         }}
         roleResourceId={selectedRoleResource?.RoleResourceId} // Ensuring it's correctly set
         selectedRoleResource={selectedRoleResource}
         selectedRole={selectedRole}
       />
       
        )}
      </section>
    </DashboardLayout>
  );
};

export default PermissionAllocationPage;