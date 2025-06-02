
# TagFlow Central - Industrial Tag Management System

## Overview

TagFlow Central is a comprehensive industrial tag management system designed for real-time data connectivity and monitoring. It provides a centralized platform for managing industrial tags, data sources, and monitoring systems with support for multiple communication protocols including OPC UA, MQTT, Modbus, and HTTPS APIs.

## Features

### Core Functionality
- **Tag Management**: Create, edit, delete, and organize industrial tags
- **Real-time Data**: Live tag values with configurable update intervals
- **Data Sources**: Multiple protocol support (OPC UA, MQTT, Modbus, HTTPS)
- **Group Organization**: Hierarchical tag grouping for better organization
- **Search & Filter**: Advanced filtering by type, group, and search terms
- **Bulk Operations**: Select and modify multiple tags simultaneously

### Data Source Support
- **OPC UA**: Industry-standard communication protocol
- **MQTT**: Lightweight messaging for IoT devices
- **Modbus TCP**: Industrial communication protocol
- **HTTPS APIs**: RESTful web service integration
- **Internal Tags**: System-generated values

### Advanced Features
- **Alarm Management**: Configurable high/low limit alarms
- **Data Logging**: Historical data storage with configurable retention
- **Real-time Updates**: Live tag value monitoring
- **Connection Status**: Monitor data source connectivity
- **Export/Import**: CSV-based tag configuration management

## Technology Stack

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Chakra UI**: Component library for consistent design
- **Zustand**: State management
- **React Query**: Data fetching and caching
- **React Router**: Client-side routing

### Backend
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **Row Level Security**: Data access control
- **Real-time subscriptions**: Live data updates

### Development Tools
- **Vite**: Build tool and development server
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## Database Schema

### Tables

#### `tags`
Stores industrial tag definitions and configurations:
- `id` (uuid, primary key)
- `name` (text, required) - Tag identifier
- `data_type` (text, required) - Data type (Bool, Int16, Int32, Real, String, DateTime)
- `address` (text, required) - Tag address/location
- `value` (text) - Current tag value
- `comment` (text) - Optional description
- `group_name` (text, required) - Associated group
- `active` (boolean) - Tag status
- `retain` (boolean) - Value retention flag
- `data_source` (text, required) - Source protocol
- `mqtt_path` (text) - MQTT topic path
- `opc_node_id` (text) - OPC UA node identifier
- `modbus_register` (integer) - Modbus register address
- `update_interval` (text) - Update frequency
- `multiplier` (numeric) - Value scaling factor
- `device_id` (text) - Source device identifier
- `direct_logging` (boolean) - Enable data logging
- `log_duration` (text) - Log retention period
- `alarm_enabled` (boolean) - Enable alarms
- `alarm_high_limit` (numeric) - High alarm threshold
- `alarm_low_limit` (numeric) - Low alarm threshold
- `connection_status` (text) - Current connection state
- `created_at` (timestamp) - Creation time
- `updated_at` (timestamp) - Last modification time

#### `groups`
Organizes tags into hierarchical groups:
- `id` (uuid, primary key)
- `name` (text, required) - Group name
- `expanded` (boolean) - UI expansion state
- `parent_id` (uuid) - Parent group reference
- `description` (text) - Optional description
- `created_at` (timestamp) - Creation time
- `updated_at` (timestamp) - Last modification time

### Relationships
- Groups can have parent-child relationships for hierarchical organization
- Tags belong to groups via `group_name` field

## Project Structure

```
src/
├── components/           # React components
│   ├── tag-flow/        # Main application components
│   │   ├── Header.tsx   # Application header
│   │   └── Toolbar.tsx  # Action toolbar
│   ├── tag-modal/       # Tag creation/editing
│   │   ├── BasicTab.tsx       # Basic tag properties
│   │   ├── DataSourceTab.tsx  # Data source configuration
│   │   └── LoggingAlarmsTab.tsx # Logging and alarm settings
│   ├── tag-table/       # Tag data display
│   │   ├── TableHeader.tsx    # Column headers
│   │   ├── TableRow.tsx       # Data rows
│   │   └── TableCell.tsx      # Individual cells
│   ├── tag-tree/        # Tag group navigation
│   │   └── GroupItem.tsx      # Group display component
│   ├── data-source/     # Data source management
│   │   ├── ConnectionList.tsx # Active connections
│   │   └── NewConnectionForm.tsx # Add new connections
│   ├── ui/              # Reusable UI components
│   ├── TagFlowCentral.tsx     # Main application component
│   ├── TagTable.tsx           # Tag data table
│   ├── TagTree.tsx            # Tag group tree
│   ├── TagModal.tsx           # Tag editing modal
│   ├── SettingsModal.tsx      # Application settings
│   └── DataSourceModal.tsx    # Data source management
├── hooks/               # React hooks
│   ├── useTags.ts       # Tag data management
│   ├── useGroups.ts     # Group data management
│   └── use-toast.ts     # Toast notifications
├── services/            # API services
│   └── tagService.ts    # Supabase integration
├── store/               # State management
│   └── tagStore.ts      # Application state
├── theme/               # UI theming
│   └── theme.ts         # Chakra UI theme
└── pages/               # Route components
    ├── Index.tsx        # Home page
    └── NotFound.tsx     # 404 page
```

## Component Architecture

### Core Components
- **TagFlowCentral**: Main application container
- **Header**: Application branding and title
- **Toolbar**: Action buttons and filters
- **TagTable**: Data grid with sorting and selection
- **TagTree**: Hierarchical group navigation
- **TagModal**: Tag creation and editing interface

### Modal Components
- **BasicTab**: Tag name, type, address, and basic properties
- **DataSourceTab**: Protocol-specific configuration
- **LoggingAlarmsTab**: Historical logging and alarm settings

### Data Management
- **useTags**: Tag CRUD operations
- **useGroups**: Group management
- **tagService**: Supabase API integration
- **tagStore**: Client-side state management

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation
```bash
# Clone repository
git clone <repository-url>
cd tagflow-central

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
The application uses Supabase for backend services. Configure your Supabase project credentials in the integration files.

## Usage Guide

### Creating Tags
1. Click "Add Tag" in the toolbar
2. Fill in basic information (name, type, address)
3. Configure data source settings
4. Set up logging and alarms if needed
5. Save the tag

### Managing Groups
1. Use "Add Group" in the tag tree
2. Organize tags by dragging to groups
3. Expand/collapse groups for navigation
4. Delete empty groups as needed

### Data Sources
1. Access via toolbar "Data Sources" button
2. Add new connections for external systems
3. Test connections before using
4. Monitor connection status

### Filtering and Search
1. Use search bar for tag names and comments
2. Filter by data type or group
3. Select multiple tags for bulk operations
4. Sort columns by clicking headers

## API Integration

### Supabase Services
- Real-time subscriptions for live updates
- Row Level Security for data protection
- Automatic timestamp management
- Type-safe API calls

### External Protocols
- OPC UA client integration
- MQTT broker connections
- Modbus TCP communication
- RESTful API polling

## Security Features

### Data Access
- Row Level Security policies
- Type-safe database operations
- Input validation and sanitization
- Error handling and logging

### Connection Security
- Encrypted communications
- Authentication for external systems
- Connection timeout handling
- Status monitoring

## Performance Optimizations

### Frontend
- React Query for efficient data fetching
- Component lazy loading
- Optimistic updates for better UX
- Memoized expensive calculations

### Backend
- Database indexing for fast queries
- Connection pooling for external systems
- Batch operations for bulk updates
- Real-time subscriptions over polling

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build locally
npm run preview
```

### Environment Variables
Configure the following in your deployment environment:
- Supabase URL and API keys
- External system credentials
- Logging configuration

## Contributing

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Component-based architecture
- Comprehensive error handling

### Testing
- Unit tests for business logic
- Integration tests for API calls
- E2E tests for critical workflows
- Performance testing for large datasets

## Future Enhancements

### Planned Features
- Dashboard with charts and graphs
- Email/SMS alarm notifications
- Advanced data analytics
- Mobile responsive design
- Multi-tenant support
- API documentation
- Plugin system for custom protocols

### Technical Improvements
- Real-time data streaming
- Advanced caching strategies
- Offline support
- Performance monitoring
- Automated testing
- CI/CD pipeline
- Documentation site

## Support

For technical support or feature requests, please refer to the project documentation or contact the development team.

## License

This project is proprietary software. All rights reserved.
