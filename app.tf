


terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "unity-in-diversity-rg"
  location = "East US"
}

resource "azurerm_container_registry" "acr" {
  name                = "unityindiversityacr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
  admin_enabled       = true
}

resource "azurerm_app_service_plan" "asp" {
  name                = "unity-in-diversity-asp"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "app" {
  name                = "unity-in-diversity-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.asp.id

  site_config {
    linux_fx_version = "DOCKER|${azurerm_container_registry.acr.login_server}/unity-in-diversity:latest"
    always_on        = true
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.acr.admin_password
    "WEBSITES_PORT"                       = "3000"
    "DATABASE_URL"                        = var.database_url
    "AUTH_SECRET"                         = var.auth_secret
    "AUTH_URL"                            = var.auth_url
    "AUTH_AZURE_AD_ID"                    = var.auth_azure_ad_id
    "AUTH_AZURE_AD_SECRET"                = var.auth_azure_ad_secret
    "AUTH_AZURE_AD_TENANT"                = var.auth_azure_ad_tenant
  }
}