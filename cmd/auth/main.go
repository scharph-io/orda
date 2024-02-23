package main

import (
	"fmt"

	"github.com/harranali/authority"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// https://www.honeybadger.io/blog/a-step-by-step-guide-to-creating-production-ready-apis-in-go-with-gin-and-gorm/

type CRUDPermission struct {
	Create authority.Permission
	Read   authority.Permission
	Update authority.Permission
	Delete authority.Permission
}

// Roles

var adminRole = authority.Role{
	Name: "Admin",
	Slug: "admin",
}

var userRole = authority.Role{
	Name: "User",
	Slug: "user",
}

// Permissions
var categoryPerms = CRUDPermission{
	Create: authority.Permission{
		Name: "Create Category",
		Slug: "create-category",
	},
	Read: authority.Permission{
		Name: "Read Category",
		Slug: "read-category",
	},
	Update: authority.Permission{
		Name: "Update Category",
		Slug: "update-category",
	},
	Delete: authority.Permission{
		Name: "Delete Category",
		Slug: "delete-category",
	},
}

var articlePerms = CRUDPermission{
	Create: authority.Permission{
		Name: "Create Article",
		Slug: "create-article",
	},
	Read: authority.Permission{
		Name: "Read Article",
		Slug: "read-article",
	},
	Update: authority.Permission{
		Name: "Update Article",
		Slug: "update-article",
	},
	Delete: authority.Permission{
		Name: "Delete Article",
		Slug: "delete-article",
	},
}

var userPerms = CRUDPermission{
	Create: authority.Permission{
		Name: "Create User",
		Slug: "create-user",
	},
	Read: authority.Permission{
		Name: "Read User",
		Slug: "read-user",
	},
	Update: authority.Permission{
		Name: "Update User",
		Slug: "update-user",
	},
	Delete: authority.Permission{
		Name: "Delete User",
		Slug: "delete-user",
	},
}

func CreateCRUDPermissions(auth *authority.Authority, perms CRUDPermission) {
	// Create Permissions
	permissions := []authority.Permission{
		perms.Create,
		perms.Read,
		perms.Update,
		perms.Delete,
	}

	for _, p := range permissions {
		err := auth.CreatePermission(p)
		if err != nil {
			fmt.Println(err)
		}
	}

}

func main() {
	fmt.Println("Hello, World!")

	dsn := "root:example@tcp(127.0.0.1:3306)/orda?charset=utf8mb4&parseTime=True&loc=Local"
	db, _ := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	// initiate authority
	auth := authority.New(authority.Options{
		TablesPrefix: "authority_",
		DB:           db,
	})

	roles := []authority.Role{
		adminRole,
		userRole,
	}

	// Create Roles
	for _, r := range roles {
		err := auth.CreateRole(r)
		if err != nil {
			fmt.Println(err)
		}
	}

	// Create Permissions
	CreateCRUDPermissions(auth, categoryPerms)
	CreateCRUDPermissions(auth, articlePerms)
	CreateCRUDPermissions(auth, userPerms)

	// admin role
	if err := auth.AssignPermissionsToRole(adminRole.Slug, []string{
		// Category Permissions
		categoryPerms.Create.Slug,
		categoryPerms.Read.Slug,
		categoryPerms.Update.Slug,
		categoryPerms.Delete.Slug,

		// Article Permissions
		articlePerms.Create.Slug,
		articlePerms.Read.Slug,
		articlePerms.Update.Slug,
		articlePerms.Delete.Slug,

		// User Permissions
		userPerms.Create.Slug,
		userPerms.Read.Slug,
		userPerms.Update.Slug,
		userPerms.Delete.Slug,
	}); err != nil {
		fmt.Println(err)
	}

	// admin role
	if err := auth.AssignPermissionsToRole(userRole.Slug, []string{
		// Category Permissions
		categoryPerms.Read.Slug,

		// Article Permissions
		articlePerms.Read.Slug,
	}); err != nil {
		fmt.Println(err)
	}

	// assign a role to user (user id = 1)
	// err = auth.AssignRoleToUser(1, "role-1")

	// // check if the user have a given role
	// ok, err := auth.CheckUserRole(1, "role-a")
	// if ok {
	// 	fmt.Println("yes, user has the role assigned")
	// }

	// // check if a user have a given permission
	// ok, err = auth.CheckUserPermission(1, "permission-d")
	// if ok {
	// 	fmt.Println("yes, user has the permission assigned")
	// }

	// check if a role have a given permission
	ok, _ := auth.CheckRolePermission(adminRole.Slug, articlePerms.Create.Slug)
	if ok {
		fmt.Println("yes, role has the permission assigned")
	}

	ok, _ = auth.CheckRolePermission(userRole.Slug, articlePerms.Create.Slug)
	if ok {
		fmt.Println("yes, role has the permission assigned")
	} else {
		fmt.Println("no, role does not have the permission assigned")
	}

	auth.AssignRoleToUser(1, adminRole.Slug)

	// check if the user have a given role
	ok, _ = auth.CheckUserRole(1, adminRole.Slug)
	if ok {
		fmt.Println("yes, user has the role assigned")
	} else {
		fmt.Println("no, user does not have the role assigned")
	}

}
