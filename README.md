# DGX Components

Reusable UI components, animations, and integrations by DGX Enterprise AI.

## Component catalog

| Component | Stack | Import guide |
| --- | --- | --- |
| Aviation airport map | React + Leaflet + OpenStreetMap | [Source, preview, and Lovable instructions](components/aviation-airport-map/README.md) |

| STEM aviation schools map | React + Leaflet + OpenStreetMap | [Source and Lovable integration instructions](components/stem-schools-map/README.md) |
| Aviation Airflow program explorer | React + TypeScript + Canvas | [Source and Lovable integration instructions](components/aviation-airflow/README.md) |

## Using components in Lovable

Share the GitHub URL of the specific component folder in Lovable Build mode. Ask Lovable to read that folder's README, fetch the source files using its raw GitHub URLs, install the listed dependencies, and integrate the component into the existing page.

Each component is independent. Do not replace your application's package.json with a component demo's package.json.

## Organization

Keep each component under components/<descriptive-name>/ with its source, scoped styles, README, and a preview/demo where useful. Document dependencies, external services, accessibility behavior, and validation limitations. Keep private client data, credentials, and unlicensed assets out of this public repository.

## First component

The aviation airport map shows McClellan–Palomar (KCRQ) and Montgomery–Gibbs Executive (KMYF), with a smooth illustrative aircraft animation, interactive airport selection, directions, and responsive layout. It uses real OpenStreetMap tiles without an API key. Map attribution and provider usage terms apply.

[Open airport-map source](components/aviation-airport-map/) · [Read import instructions](components/aviation-airport-map/README.md)
