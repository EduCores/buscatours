import re

filepath = r'C:\Users\Admin\Local Sites\buscatours\modern-app\src\components\admin\ToursManagement.tsx'

with open(filepath, 'r', encoding='utf-8-sig') as f:
    content = f.read()

# Remove all existing newlines to get back to the single-line corrupted state
content = content.replace('\n', '').replace('\r', '')
print(f'Working with {len(content)} chars')

# Now rebuild with proper line breaks
# Strategy: walk through the content and insert breaks at known positions

lines = []

# Known line boundaries from the original file structure
# We'll use semicolons, braces, and known keyword transitions

# Split approach: use regex to find line boundaries
# A new line starts when we see certain patterns after a line-ending character

# Step 1: Split on import statements
# import ... from '...';
parts = re.split(r"(?=import )", content)
# Each part is an import line or the rest

result_lines = []
for part in parts:
    if part.startswith('import '):
        # This is an import statement - find the end (the semicolon)
        # But be careful: the import might span what was originally multiple lines
        # In the corrupted file, multi-line imports are just concatenated
        
        # Check if this starts with the lucide-react import (which was multi-line)
        if 'Plus, Edit2' in part:
            # This was the big lucide import - split on specific patterns
            # The original had each import on a separate line
            # import { Plus, Edit2, ... } from 'lucide-react';
            # But in the corrupted file, it's all one chunk
            
            # Find the end of this import
            end_match = re.search(r"\} from 'lucide-react';", part)
            if end_match:
                import_block = part[:end_match.end()]
                rest = part[end_match.end():]
                
                # Split the import block into multiple lines
                # The original had:
                # import { Plus, Edit2, Trash2, Search, Compass, MapPin, X, \n
                #   Mountain, Parasol, Amphora, Heart, CheckCircle, AlertTriangle, Languages,\n
                #   Calendar, CheckSquare, ChevronLeft, ChevronRight, Map, Image, Video, \n
                #   Navigation, Clock, Users, MapPin as MapPinIcon, Shield, \n
                #   Loader2, Trash as TrashIcon, Plus as PlusIcon, Minus, \n
                #   ChevronDown, ChevronUp, GripVertical, Save, Copy, \n
                #   CalendarDays, CalendarRange, CalendarCheck, CalendarX,\n
                #   MapPin as MapPinIcon2, User, Shield as ShieldIcon, \n
                #   Truck, Utensils, Bed, Globe, Truck as TruckIcon,\n
                #   Star, MapPin as MapPinIcon3, Camera, Video as VideoIcon,\n
                #   Calendar, CalendarDays as CalendarDaysIcon, \n
                #   CalendarRange as CalendarRangeIcon, CalendarCheck as CalendarCheckIcon,\n
                #   CalendarX as CalendarXIcon, MapPin as MapPinIcon4, \n
                #   User as UserIcon, Shield as ShieldIcon2, \n
                #   Truck as TruckIcon2, Utensils, Bed, Globe, Truck as TruckIcon3,\n
                #   Star, MapPin as MapPinIcon5, Camera, Video as VideoIcon2,\n
                #   Calendar as CalendarIcon2, CalendarDays as CalendarDaysIcon2, \n
                #   CalendarRange as CalendarRangeIcon2, CalendarCheck as CalendarCheckIcon2,\n
                #   CalendarX as CalendarXIcon2, MapPin as MapPinIcon6, \n
                #   User as UserIcon2, Shield as ShieldIcon3, \n
                #   Truck as TruckIcon4, Utensils, Bed, Globe, Truck as TruckIcon5\n
                # } from 'lucide-react';
                
                # Split by known aliases to reconstruct original lines
                import_items = import_block
                
                # Build the multi-line import manually based on known structure
                lucide_import = """import { Plus, Edit2, Trash2, Search, Compass, MapPin, X, 
  Mountain, Parasol, Amphora, Heart, CheckCircle, AlertTriangle, Languages,
  Calendar, CheckSquare, ChevronLeft, ChevronRight, Map, Image, Video, 
  Navigation, Clock, Users, MapPin as MapPinIcon, Shield, 
  Loader2, Trash as TrashIcon, Plus as PlusIcon, Minus, 
  ChevronDown, ChevronUp, GripVertical, Save, Copy, 
  CalendarDays, CalendarRange, CalendarCheck, CalendarX,
  MapPin as MapPinIcon2, User, Shield as ShieldIcon, 
  Truck, Utensils, Bed, Globe, Truck as TruckIcon,
  Star, MapPin as MapPinIcon3, Camera, Video as VideoIcon,
  Calendar, CalendarDays as CalendarDaysIcon, 
  CalendarRange as CalendarRangeIcon, CalendarCheck as CalendarCheckIcon,
  CalendarX as CalendarXIcon, MapPin as MapPinIcon4, 
  User as UserIcon, Shield as ShieldIcon2, 
  Truck as TruckIcon2, Utensils, Bed, Globe, Truck as TruckIcon3,
  Star, MapPin as MapPinIcon5, Camera, Video as VideoIcon2,
  Calendar as CalendarIcon2, CalendarDays as CalendarDaysIcon2, 
  CalendarRange as CalendarRangeIcon2, CalendarCheck as CalendarCheckIcon2,
  CalendarX as CalendarXIcon2, MapPin as MapPinIcon6, 
  User as UserIcon2, Shield as ShieldIcon3, 
  Truck as TruckIcon4, Utensils, Bed, Globe, Truck as TruckIcon5
} from 'lucide-react';"""
                
                result_lines.append(lucide_import)
                
                if rest:
                    # Process the rest - it starts with the next import
                    remaining = rest
                    while remaining:
                        if remaining.startswith('import '):
                            semi = remaining.index(';')
                            result_lines.append(remaining[:semi+1])
                            remaining = remaining[semi+1:]
                        elif remaining.startswith('interface ') or remaining.startswith('export ') or remaining.startswith('const ') or remaining.startswith('  '):
                            # This is the start of the actual component code
                            # We need to handle this differently
                            break
                        else:
                            # Skip
                            break
                    if remaining:
                        content = remaining
                    continue
            else:
                result_lines.append(part)
                continue
        else:
            # Simple import
            semi = part.index(';')
            result_lines.append(part[:semi+1])
            rest = part[semi+1:]
            if rest:
                content = rest
            continue

# Now handle the rest of the content (non-import code)
# This is the tricky part - we need to split on line boundaries

# Reset content to everything after imports
# Find where imports end
import_end = 0
temp = '\n'.join(result_lines)
remaining_content = content

# Find the start of non-import content
for pattern in ['interface ToursManagementProps', 'export default function']:
    idx = remaining_content.find(pattern)
    if idx >= 0:
        if import_end == 0 or idx < import_end:
            import_end = idx

if import_end > 0:
    non_import = remaining_content[import_end:]
else:
    non_import = remaining_content

print(f'Non-import content: {len(non_import)} chars')
print(f'Starts with: {non_import[:60]}')

# For the non-import content, we need to insert line breaks
# Strategy: insert break before known line-starting patterns

# Build the line breaks
output = list(non_import)

# Find positions to insert newlines
insert_positions = set()

for m in re.finditer(r";(const |let |var |//|return |if |else |for |while |interface |export |import |    )", non_import):
    insert_positions.add(m.start() + 1)

for m in re.finditer(r"\}(const |let |var |//|return |interface |export |import |  |\))", non_import):
    insert_positions.add(m.start() + 1)

for m in re.finditer(r"\);(const |let |var |//|return |    |\))", non_import):
    insert_positions.add(m.start() + 1)

for m in re.finditer(r"\}(  +)(const |let |var |//|return |interface |export |\})", non_import):
    insert_positions.add(m.start() + 1)

# Also split before JSX comments
for m in re.finditer(r"\S(\{/\*)", non_import):
    insert_positions.add(m.end() - 2)

# Also split before {activeTab
for m in re.finditer(r"\n(\{activeTab)", non_import):
    pass  # won't match since no newlines

for m in re.finditer(r";(\{activeTab)", non_import):
    insert_positions.add(m.start() + 1)

# Sort positions
positions = sorted(insert_positions)

# Insert newlines
result = list(non_import)
offset = 0
for pos in positions:
    adjusted_pos = pos + offset
    if adjusted_pos < len(result):
        result.insert(adjusted_pos, '\n')
        offset += 1

non_import_result = ''.join(result)

# Combine imports and non-import content
full_result = '\n'.join(result_lines) + '\n' + non_import_result

# Clean up: remove empty lines that might have been created, and fix double newlines
full_result = re.sub(r'\n{3,}', '\n\n', full_result)

final_lines = full_result.split('\n')
print(f'Final line count: {len(final_lines)}')

with open(filepath, 'w', encoding='utf-8-sig') as f:
    f.write(full_result)

# Show sample
for i, line in enumerate(final_lines[:5]):
    print(f'{i+1}: {line[:100]}')
print('...')
for i, line in enumerate(final_lines[-5:], len(final_lines)-4):
    print(f'{i}: {line[:100]}')
