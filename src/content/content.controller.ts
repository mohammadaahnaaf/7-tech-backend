import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    // eslint-disable-next-line prettier/prettier
    UnauthorizedException
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    // eslint-disable-next-line prettier/prettier
    ApiTags
} from '@nestjs/swagger';
import { GetCurrentUser, Public } from '../common/decorators';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './schema';

@ApiTags('Content')
@Controller('content')
export class ContentController {
    constructor(private contentService: ContentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a content' })
    @ApiCreatedResponse({ type: Content })
    @ApiBearerAuth()
    create(
        @GetCurrentUser('isAdmin') isAdmin: boolean,
        @Body() createContentDto: CreateContentDto
    ): Promise<Content> {
        if (!isAdmin) {
            throw new UnauthorizedException('Admin access denied');
        }

        return this.contentService.create(createContentDto);
    }

    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({
        name: 'content-type',
        example: 'terms',
        required: false,
        enum: ['terms', 'privacy', 'about'],
    })
    @ApiOperation({ summary: 'Get content' })
    @ApiOkResponse({ type: Content })
    find(@Query('content-type') contentType: string) {
        return this.contentService.find(contentType);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
        return this.contentService.update(+id, updateContentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contentService.remove(+id);
    }
}
